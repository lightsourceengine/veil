/*
 * Copyright (c) 2022 Light Source Software, LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { EventEmitter } from 'events'
import constants from 'node:constants'
import {
  errnoException,
  ERR_INVALID_ARG_VALUE,
  ERR_INVALID_SYNC_FORK_INPUT,
  ERR_IPC_SYNC_FORK,
  ERR_IPC_ONE_PIPE,
  ERR_UNKNOWN_SIGNAL
} from './errors.mjs'
import {
  validateObject,
  validateOneOf,
  validateString,
  validateArray
} from './validators.mjs'

const {
  Process,
  Pipe
} = import.meta.native

const { signals } = constants.os

const {
  UV_EACCES,
  UV_EAGAIN,
  UV_EINVAL,
  UV_EMFILE,
  UV_ENFILE,
  UV_ENOENT,
  UV_ENOSYS,
  UV_ESRCH
} = constants.uv.errno

const kIsUsedAsStdio = Symbol('kIsUsedAsStdio');

export class ChildProcess extends EventEmitter {
  _closesNeeded = 1;
  _closesGot = 0;
  connected = false;

  signalCode = null;
  exitCode = null;
  killed = false;
  spawnfile = null;

  _handle = null
  stdin = null

  constructor () {
    super()

    this._handle = new Process();
    // TODO: this is for async resource stuff
    // this._handle[owner_symbol] = this;

    this._handle.onexit = (exitCode, signalCode) => {
      if (signalCode) {
        this.signalCode = signalCode;
      } else {
        this.exitCode = exitCode;
      }

      const { stdin, _handle, spawnfile, spawnargs } = this

      stdin?.destroy();

      _handle.close();
      this._handle = null;

      if (exitCode < 0) {
        const syscall = spawnfile ? `spawn ${spawnfile}` : 'spawn';
        const err = errnoException(exitCode, syscall);

        if (spawnfile)
          err.path = spawnfile;

        err.spawnargs = spawnargs.slice(1);
        this.emit('error', err);
      } else {
        this.emit('exit', this.exitCode, this.signalCode);
      }

      // If any of the stdio streams have not been touched,
      // then pull all the data through so that it can get the
      // eof and emit a 'close' event.
      // Do it on nextTick so that the user has one last chance
      // to consume the output, if for example they only want to
      // start reading the data once the process exits.
      process.nextTick(flushStdio, this);

      maybeClose(this);
    };
  }

  spawn(options) {
    let i = 0;

    validateObject(options, 'options');

    // If no `stdio` option was given - use default
    let stdio = options.stdio || 'pipe';

    stdio = getValidStdio(stdio, false);

    const ipc = stdio.ipc;
    const ipcFd = stdio.ipcFd;
    stdio = options.stdio = stdio.stdio;


    validateOneOf(options.serialization, 'options.serialization', [undefined, 'json', 'advanced']);
    const serialization = options.serialization || 'json';

    if (ipc !== undefined) {
      // Let child process know about opened IPC channel
      if (options.envPairs === undefined)
        options.envPairs = [];
      else
        validateArray(options.envPairs, 'options.envPairs');

      options.envPairs.push(`NODE_CHANNEL_FD=${ipcFd}`);
      options.envPairs.push(`NODE_CHANNEL_SERIALIZATION_MODE=${serialization}`);
    }

    validateString(options.file, 'options.file');
    this.spawnfile = options.file;

    if (options.args === undefined) {
      this.spawnargs = [];
    } else {
      validateArray(options.args, 'options.args');
      this.spawnargs = options.args;
    }

    const err = this._handle.spawn(options);

    // Run-time errors should emit an error, not throw an exception.
    if (err === UV_EACCES ||
      err === UV_EAGAIN ||
      err === UV_EMFILE ||
      err === UV_ENFILE ||
      err === UV_ENOENT) {
      process.nextTick(onErrorNT, this, err);

      // There is no point in continuing when we've hit EMFILE or ENFILE
      // because we won't be able to set up the stdio file descriptors.
      if (err === UV_EMFILE || err === UV_ENFILE)
        return err;
    } else if (err) {
      // Close all opened fds on error
      for (i = 0; i < stdio.length; i++) {
        const stream = stdio[i];
        if (stream.type === 'pipe') {
          stream.handle.close();
        }
      }

      this._handle.close();
      this._handle = null;
      throw errnoException(err, 'spawn');
    } else {
      process.nextTick(onSpawnNT, this);
    }

    this.pid = this._handle.pid;

    for (i = 0; i < stdio.length; i++) {
      const stream = stdio[i];
      if (stream.type === 'ignore') continue;

      if (stream.ipc) {
        this._closesNeeded++;
        continue;
      }

      // The stream is already cloned and piped, thus stop its readable side,
      // otherwise we might attempt to read from the stream when at the same time
      // the child process does.
      if (stream.type === 'wrap') {
        stream.handle.reading = false;
        stream.handle.readStop();
        stream._stdio.pause();
        stream._stdio.readableFlowing = false;
        stream._stdio._readableState.reading = false;
        stream._stdio[kIsUsedAsStdio] = true;
        continue;
      }

      if (stream.handle) {
        stream.socket = createSocket(this.pid !== 0 ?
          stream.handle : null, i > 0);

        if (i > 0 && this.pid !== 0) {
          this._closesNeeded++;
          stream.socket.on('close', () => {
            maybeClose(this);
          });
        }
      }
    }

    this.stdin = stdio.length >= 1 && stdio[0].socket !== undefined ?
      stdio[0].socket : null;
    this.stdout = stdio.length >= 2 && stdio[1].socket !== undefined ?
      stdio[1].socket : null;
    this.stderr = stdio.length >= 3 && stdio[2].socket !== undefined ?
      stdio[2].socket : null;

    this.stdio = [];

    for (i = 0; i < stdio.length; i++)
      this.stdio.push(stdio[i].socket === undefined ? null : stdio[i].socket);

    // Add .send() method and start listening for IPC data
    // TODO: if (ipc !== undefined) setupChannel(this, ipc, serialization);
    if (ipc !== undefined) throw Error('ipc not supported')

    return err;
  }

  kill(sig) {
    const signal = sig === 0 ? sig : convertToValidSignal(sig === undefined ? 'SIGTERM' : sig);

    if (this._handle) {
      const err = this._handle.kill(signal);
      if (err === 0) {
        /* Success. */
        this.killed = true;
        return true;
      }
      if (err === UV_ESRCH) {
        /* Already dead. */
      } else if (err === UV_EINVAL || err === UV_ENOSYS) {
        /* The underlying platform doesn't support this signal. */
        throw errnoException(err, 'kill');
      } else {
        /* Other error, almost certainly EPERM. */
        this.emit('error', errnoException(err, 'kill'));
      }
    }

    /* Kill didn't succeed. */
    return false;
  }

  ref() {
    this._handle?.ref();
  }

  unref() {
    this._handle?.unref();
  }
}

const flushStdio = (subprocess) => {
  const { stdio } = subprocess;

  if (stdio == null) return;

  for (let i = 0; i < stdio.length; i++) {
    const stream = stdio[i];
    // TODO(addaleax): This doesn't necessarily account for all the ways in
    // which data can be read from a stream, e.g. being consumed on the
    // native layer directly as a StreamBase.
    if (!stream || !stream.readable || stream[kIsUsedAsStdio]) {
      continue;
    }
    stream.resume();
  }
}

const maybeClose = (subprocess) => {
  subprocess._closesGot++;

  if (subprocess._closesGot === subprocess._closesNeeded) {
    subprocess.emit('close', subprocess.exitCode, subprocess.signalCode);
  }
}

const stdioStringToArray = (stdio, channel) => {
  const options = [];

  switch (stdio) {
    case 'ignore':
    case 'overlapped':
    case 'pipe': options.push(stdio, stdio, stdio); break;
    case 'inherit': options.push(0, 1, 2); break;
    default:
      throw new ERR_INVALID_ARG_VALUE('stdio', stdio);
  }

  if (channel) options.push(channel);

  return options;
}

const getValidStdio = (stdio, sync) => {
  let ipc;
  let ipcFd;

  // Replace shortcut with an array
  if (typeof stdio === 'string') {
    stdio = stdioStringToArray(stdio);
  } else if (!Array.isArray(stdio)) {
    throw new ERR_INVALID_ARG_VALUE('stdio', stdio);
  }

  // At least 3 stdio will be created
  // Don't concat() a new Array() because it would be sparse, and
  // stdio.reduce() would skip the sparse elements of stdio.
  // See https://stackoverflow.com/a/5501711/3561
  while (stdio.length < 3) stdio.push(undefined);

  // Translate stdio into C++-readable form
  // (i.e. PipeWraps or fds)
  stdio = stdio.reduce((acc, stdio, i) => {
    const cleanup = () => {
      for (let i = 0; i < acc.length; i++) {
        const { type, handle } = acc[i];
        (type === 'pipe' || type === 'ipc') && handle?.close()
      }
    }

    // Defaults
    if (stdio == null) {
      stdio = i < 3 ? 'pipe' : 'ignore';
    }

    if (stdio === 'ignore') {
      acc.push({ type: 'ignore' });
    } else if (stdio === 'pipe' || stdio === 'overlapped' ||
      (typeof stdio === 'number' && stdio < 0)) {
      const a = {
        type: stdio === 'overlapped' ? 'overlapped' : 'pipe',
        readable: i === 0,
        writable: i !== 0
      };

      if (!sync)
        a.handle = new Pipe(Pipe.SOCKET);

      acc.push(a);
    } else if (stdio === 'ipc') {
      if (sync || ipc !== undefined) {
        // Cleanup previously created pipes
        cleanup();
        if (!sync)
          throw new ERR_IPC_ONE_PIPE();
        else
          throw new ERR_IPC_SYNC_FORK();
      }

      ipc = new Pipe(Pipe.IPC);
      ipcFd = i;

      acc.push({
        type: 'pipe',
        handle: ipc,
        ipc: true
      });
    } else if (stdio === 'inherit') {
      acc.push({
        type: 'inherit',
        fd: i
      });
    } else if (typeof stdio === 'number' || typeof stdio.fd === 'number') {
      acc.push({
        type: 'fd',
        fd: typeof stdio === 'number' ? stdio : stdio.fd
      });
    } else if (getHandleWrapType(stdio) || getHandleWrapType(stdio.handle) ||
      getHandleWrapType(stdio._handle)) {
      const handle = getHandleWrapType(stdio) ?
        stdio :
        getHandleWrapType(stdio.handle) ? stdio.handle : stdio._handle;

      acc.push({
        type: 'wrap',
        wrapType: getHandleWrapType(handle),
        handle: handle,
        _stdio: stdio
      });
    } else if (ArrayBuffer.isView(stdio) || typeof stdio === 'string') {
      if (!sync) {
        cleanup();
        throw new ERR_INVALID_SYNC_FORK_INPUT(stdio.toString());
      }
    } else {
      // Cleanup
      cleanup();
      throw new ERR_INVALID_ARG_VALUE('stdio', stdio);
    }

    return acc;
  }, [])

  return { stdio, ipc, ipcFd };
}

const onErrorNT = (self, err) => self._handle.onexit(err)

const onSpawnNT = (self) => self.emit('spawn')

const createSocket = (pipe, readable) => {
  // TODO: return Socket({ handle: pipe, readable });
  throw Error('createSocket not implemented')
}

const getHandleWrapType = (stream) => {
  if (stream instanceof Pipe) return 'pipe';
  // TODO: these stream type not supported, yet
  // if (stream instanceof TTY) return 'tty';
  // if (stream instanceof TCP) return 'tcp';
  // if (stream instanceof UDP) return 'udp';

  return false;
}

let signalsToNamesMapping;
const getSignalsToNamesMapping = () => {
  if (signalsToNamesMapping !== undefined)
    return signalsToNamesMapping;

  signalsToNamesMapping = {};
  for (const key in signals) {
    signalsToNamesMapping[signals[key]] = key;
  }

  return signalsToNamesMapping;
}

export const convertToValidSignal = (signal) => {
  if (typeof signal === 'number' && getSignalsToNamesMapping()[signal])
    return signal;

  if (typeof signal === 'string') {
    const signalName = signals[signal.toUpperCase()];
    if (signalName) return signalName;
  }

  throw new ERR_UNKNOWN_SIGNAL(signal);
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
