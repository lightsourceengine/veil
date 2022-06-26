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

import EventEmitter from 'events'
import { Duplex } from 'stream'
import { assert } from 'assert'
import TCP from 'tcp'
import { lookup } from 'dns'

const { errname } = TCP
const createTCP = () => new TCP()

// Expected end message on nuttx platform.
var expectedEnding;

if (process.platform === 'nuttx') {
   expectedEnding = new Buffer('\\e\\n\\d');
}


function SocketState(options) {
  // 'true' during connection handshaking.
  this.connecting = false;

  // become 'true' when connection established.
  this.connected = false;

  this.writable = true;
  this.readable = true;

  this.destroyed = false;
  this.errored = false;

  this.allowHalfOpen = options && options.allowHalfOpen || false;
}

class Socket extends Duplex {
  constructor (options) {
    super()

    this._timer = null;
    this._timeout = 0;

    this._socketState = new SocketState(options);

    if (options.handle) {
      this._handle = options.handle;
      this._handle.owner = this;
    }

    this.on('finish', onSocketFinish);
    this.on('end', onSocketEnd);
  }

  connect () {
    var state = this._socketState;

    var args = normalizeConnectArgs(arguments);
    var options = args[0];
    var callback = args[1];

    if (state.connecting || state.connected) {
      return this;
    }

    if (!this._handle) {
      this._handle = createTCP();
      this._handle.owner = this;
    }

    if (typeof callback === 'function') {
      this.once('connect', callback);
    }

    resetSocketTimeout(this);

    state.connecting = true;

    var host = options.host ? options.host : 'localhost';
    var port = options.port;
    var dnsopts = {
      family: options.family >>> 0,
      hints: 0,
    };

    if (typeof port !== 'number' || port < 0 || port > 65535)
      throw new RangeError('port should be >= 0 and < 65536: ' + options.port);

    if (dnsopts.family !== 0 && dnsopts.family !== 4 && dnsopts.family !== 6)
      throw new RangeError('family should be 4 or 6: ' + dnsopts.family);

    this._host = host;
    lookup(host, dnsopts, (err, ip, family) => {
      if (this._socketState.destroyed) {
        return;
      }
      this.emit('lookup', err, ip, family);

      if (err) {
        process.nextTick(() => {
          this.emit('error', err);
          this.destroy();
        });
      } else {
        resetSocketTimeout(this);
        connect(this, ip, port);
      }
    });

    return this;
  }

  write (data, callback) {
    if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
      throw new TypeError('invalid argument');
    }
    return super.write(data, callback);
  }

  _write (chunk, callback, afterWrite) {
    // TODO: validate* functions?
    assert(Buffer.isBuffer(chunk));
    assert(typeof afterWrite === 'function');

    if (this.errored) {
      process.nextTick(afterWrite, 1);
      if (typeof callback === 'function') {
        process.nextTick(() => callback.call(this, 1));
      }
    } else {
      resetSocketTimeout(this);

      this._handle.owner = this;

      this._handle.write(chunk, (status) => {
        afterWrite(status);
        if (typeof callback === 'function') {
          callback.call(this, status);
        }
      });
    }
  }

  end (data, callback) {
    var state = this._socketState;

    // end of writable stream.
    super.end(data, callback)

    // this socket is no longer writable.
    state.writable = false;
  }

  destroy () {
    var state = this._socketState;

    if (state.destroyed) {
      return;
    }

    if (state.writable) {
      this.end();
    }

    // unset timeout
    clearSocketTimeout(this);

    if (this._writableState.ended && this._handle) {
      close(this);
      state.destroyed = true;
    } else {
      this.once('finish', () => this.destroy());
    }
  }

  destroySoon () {
    var state = this._socketState;

    if (state.writable) {
      this.end();
    }

    if (this._writableState.finished) {
      this.destroy();
    } else {
      this.once('finish', () => this.destroy());
    }
  }

  setKeepAlive (enable, delay) {
    enable = Boolean(enable);
    if (this._handle && this._handle.setKeepAlive) {
      this._handle.setKeepAlive(enable, ~~(delay / 1000));
    }
  }

  address () {
    if (!this._handle || !this._handle.getsockname) {
      return {};
    }
    if (!this._sockname) {
      var out = {};
      var err = this._handle.getsockname(out);
      if (err) return {}; // FIXME(bnoordhuis) Throw?
      this._sockname = out;
    }
    return this._sockname;
  }

  setTimeout (msecs, callback) {
    this._timeout = msecs;
    clearSocketTimeout(this);

    if (msecs === 0) {
      if (callback) {
        this.removeListener('timeout', callback);
      }
    } else {
      this._timer = setTimeout(() => {
        this.emit('timeout');
        clearSocketTimeout(this);
      }, msecs);
      if (callback) {
        this.once('timeout', callback);
      }
    }
  }
}

function connect(socket, ip, port) {
  var afterConnect = (status) => {
    var state = socket._socketState;
    state.connecting = false;

    if (state.destroyed) {
      return;
    }

    if (status === 0) {
      onSocketConnect(socket);
      socket.emit('connect');
    } else {
      socket.destroy();
      emitError(socket, Error(`connect failed - status: ${errname(status)}`));
    }
  };

  var err = socket._handle.connect(ip, port, afterConnect);
  if (err) {
    emitError(socket, Error(`connect failed - status: ${errname(err)}`));
  }
}


function close(socket) {
  socket._handle.owner = socket;
  socket._handle.onclose = () => socket.emit('close')

  var handle = socket._handle;
  socket._handle = null;
  handle.close();

  if (socket._server) {
    var server = socket._server;
    server._socketCount--;
    server._emitCloseIfDrained();
    socket._server = null;
  }
}


function resetSocketTimeout(socket) {
  var state = socket._socketState;

  if (!state.destroyed) {
    // start timeout over again
    clearSocketTimeout(socket);
    socket._timer = setTimeout(() => {
      socket.emit('timeout');
      clearSocketTimeout(socket);
    }, socket._timeout);
  }
}


function clearSocketTimeout(socket) {
  if (socket._timer) {
    clearTimeout(socket._timer);
    socket._timer = null;
  }
}


function emitError(socket, err) {
  socket.errored = true;
  socket.end('', () => socket.destroy());
  socket._readyToWrite();
  socket.emit('error', err);
}


function maybeDestroy(socket) {
  var state = socket._socketState;

  if (!state.connecting &&
    !state.writable &&
    !state.readable) {
    socket.destroy();
  }
}


function onSocketConnect(socket) {
  var state = socket._socketState;

  state.connecting = false;
  state.connected = true;

  resetSocketTimeout(socket);

  socket._readyToWrite();

  // `readStart` on next tick, after connection event handled.
  process.nextTick(() => {
    socket._handle.owner = socket;
    socket._handle.onread = onread;
    socket._handle.readStart();
  });
}


function onread(socket, nread, isEOF, buffer) {
  var state = socket._socketState;

  resetSocketTimeout(socket);

  if (isEOF) {
    // pushing readable stream null means EOF.
    socket.push(null)

    if (socket._readableState.length === 0) {
      // this socket is no longer readable.
      state.readable = false;
      // destroy if this socket is not writable.
      maybeDestroy(socket);
    }
  } else if (nread < 0) {
    var err = new Error('read error: ' + nread);
    socket.error(err)
  } else if (nread > 0) {
    if (process.platform !== 'nuttx') {
      socket.push(buffer)
      return;
    }

    // We know for sure the last 6 characters are going to be the ending.
    // Lets create a buffer with those 6 characters without toString conversion.
    var eofLength = 6;
    var bufferLength = buffer.length;

    var eofNeeded = false;
    if (bufferLength >= eofLength &&
        expectedEnding.compare(buffer.slice(bufferLength - eofLength,
                                            bufferLength)) === 0) {
      eofNeeded = true;
      buffer = buffer.slice(0, bufferLength - eofLength);
    }

    if (bufferLength === eofLength && eofNeeded) {
      // Socket.prototype.end with no argument
    } else {
      socket.push(buffer)
    }

    if (eofNeeded) {
      onread(socket, 0, true, null);
    }
  }
}


// Writable stream finished.
function onSocketFinish() {
  var self = this;
  var state = self._socketState;

  if (!state.readable || self._readableState.ended || !self._handle) {
    // no readable stream or ended, destroy(close) socket.
    return self.destroy();
  } else {
    // Readable stream alive, shutdown only outgoing stream.
    self._handle.shutdown(() => {
      if (self._readableState.ended) {
        self.destroy();
      }
    });
  }
}


// Readable stream ended.
function onSocketEnd() {
  var state = this._socketState;

  maybeDestroy(this);

  if (!state.allowHalfOpen) {
    this.destroySoon();
  }
}

class Server extends EventEmitter {
  constructor (options, connectionListener) {
    super()
    if (typeof options === 'function') {
      connectionListener = options;
      options = {};
    } else {
      options = options || {};
    }

    if (typeof connectionListener === 'function') {
      this.on('connection', connectionListener);
    }

    this._handle = null;
    this._socketCount = 0;

    this.allowHalfOpen = options.allowHalfOpen || false;
  }

  listen() {
    var args = normalizeListenArgs(arguments);

    var options = args[0];
    var callback = args[1];

    var port = options.port;
    var host = typeof options.host === 'string' ? options.host : '0.0.0.0';
    var backlog = typeof options.backlog === 'number' ? options.backlog : 511;

    if (typeof port !== 'number') {
      throw new Error('invalid argument - need port number');
    }

    // register listening event listener.
    if (typeof callback === 'function') {
      this.once('listening', callback);
    }

    // Create server handle.
    if (!this._handle) {
      this._handle = createTCP();
    }

    // bind port
    var err = this._handle.bind(host, port);
    if (err) {
      this._handle.close();
      return this.emit('error', err);
    }

    // listen
    this._handle.onconnection = onconnection;
    this._handle.createTCP = createTCP;
    this._handle.owner = this;

    err = this._handle.listen(backlog);

    if (err) {
      this._handle.close();
      return this.emit('error', err);
    }

    process.nextTick(() => {
      if (this._handle) {
        this.emit('listening');
      }
    });

    return this;
  }

  address() {
    if (this._handle && this._handle.getsockname) {
      var out = {};
      this._handle.getsockname(out);
      // TODO(bnoordhuis) Check err and throw?
      return out;
    }

    return null;
  }

  close (callback) {
    if (typeof callback === 'function') {
      if (!this._handle) {
        this.once('close', () => callback(Error('Not running')));
      } else {
        this.once('close', callback);
      }
    }
    if (this._handle) {
      this._handle.close();
      this._handle = null;
    }
    this._emitCloseIfDrained();
    return this;
  }

  _emitCloseIfDrained() {
    var self = this;

    if (self._handle || self._socketCount > 0) {
      return;
    }

    process.nextTick(() => self.emit('close'));
  }
}

// This function is called after server accepted connection request
// from a client.
//  This binding
//   * server tcp handle
//  Parameters
//   * status - status code
//   * clientHandle - client socket handle (tcp).
function onconnection(status, clientHandle) {
  var server = this.owner;

  if (status) {
    server.emit('error', Error(`accept error: ${errname(status)}`));
    return;
  }

  // Create socket object for connecting client.
  var socket = new Socket({
    handle: clientHandle,
    allowHalfOpen: server.allowHalfOpen,
  });
  socket._server = server;

  onSocketConnect(socket);

  server._socketCount++;

  server.emit('connection', socket);
}


function normalizeListenArgs(args) {
  var options = {};

  if (args[0] !== null && typeof args[0] === 'object') {
    options = args[0];
  } else {
    var idx = 0;
    options.port = args[idx++];
    if (typeof args[idx] === 'string') {
      options.host = args[idx++];
    } else if (typeof args[idx] === 'number') {
      options.backlog = args[idx++];
    }
  }

  var cb = args[args.length - 1];

  return typeof cb === 'function' ? [options, cb] : [options];
}


function normalizeConnectArgs(args) {
  var options = {};

  if (args[0] !== null && typeof args[0] === 'object') {
    options = args[0];
  } else {
    options.port = args[0];
    if (typeof args[1] === 'string') {
      options.host = args[1];
    }
  }

  var cb = args[args.length - 1];

  return typeof cb === 'function' ? [options, cb] : [options];
}


const createServer = (options, callback) => new Server(options, callback)


// net.connect(options[, connectListener])
// net.connect(port[, host][, connectListener])
const createConnection = () => {
  var args = normalizeConnectArgs(arguments);
  var socket = new Socket(args[0]);
  return Socket.prototype.connect.apply(socket, args);
};

export {
  createServer,
  createConnection,
  createConnection as connect,
  Socket,
  Server
}

export default {
  createServer,
  createConnection,
  connect:createConnection,
  Socket,
  Server
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/jerryscript-project/iotjs
 * Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
