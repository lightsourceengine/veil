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

const { native } = import.meta

class Process extends EventEmitter {
  env = native.env
  argv = [ ...native.argv ]
  exitCode = 0;
  _exiting = false;
  _nextTickQueue = [];
  _microtaskQueue = [];

  get debug () { return native.debug }

  get pid () { return native.pid }

  get platform () { return native.platform }

  get arch () { return native.arch }

  get version () { return native.version }

  get versions () { return [ ...native.versions ] }

  get execPath () { return native.execPath }

  get argv0() { return native.argv0 }

  nextTick (...args) {
    checkCallback(args[0]) && this._nextTickQueue.push(args)
  }

  emitExit (code) {
    code = code || this.exitCode;
    if (typeof code !== 'number') {
      code = 0;
    }
    if (!this._exiting) {
      this._exiting = true;
      if (code || code === 0) {
        this.exitCode = code;
      }
      this.emit('exit', this.exitCode);
    }

    this.removeAllListeners()
  };

  exit (code) {
    if (!this._exiting) {
      try {
        this.emitExit(code);
      } catch (e) {
        this.exitCode = 1;
        this._onUncaughtException(e);
      } finally {
        native.doExit(this.exitCode);
      }
    }
  };

  cwd() {
    return native.cwd()
  }

  chdir(directory) {
    native.chdir(directory)
  }

  hrtime () {
    return native.hrtime()
  }

  _onNextTick() {
    // clone _nextTickQueue to new array object, and calls function
    // iterating the cloned array. This is because,
    // during processing nextTick
    // a callback could add another next tick callback using
    // `process.nextTick()`, if we calls back iterating original
    // `_nextTickQueue` that could turn into infinite loop.

    const callbacks = this._nextTickQueue.slice(0);
    this._nextTickQueue.length = 0;
    let func

    for (const callbackInfo of callbacks) {
      try {
        if (callbackInfo.length === 1) {
          callbackInfo[0]()
        } else {
          func = callbackInfo.shift()
          func(...callbackInfo)
        }
      } catch (e) {
        this._onUncaughtException(e);
      }
    }

    const tasks = this._microtaskQueue.slice(0)
    this._microtaskQueue.length = 0

    for (const task of tasks) {
      try {
        task();
      } catch (e) {
        this._onUncaughtException(e);
      }
    }

    return this._nextTickQueue.length > 0 || this._microtaskQueue.length > 0;
  }

  _queueMicrotask (task) {
    checkCallback(task) && this._microtaskQueue.push(task)
  }

  _onUncaughtException(error) {
    const event = 'uncaughtException';
    const listeners = this._events[event]

    if ((listeners ? listeners.length : 0) > 0) {
      try {
        // Emit uncaughtException event.
        this.emit(event, error);
      } catch (e) {
        console.error('Uncaught:')
        console.error(e);
        this.exit(1);
      }
    } else {
      console.error(error);

      this.exit(1);
    }
  }
}

const checkCallback = (callback) => {
  if (typeof callback !== 'function') {
    throw TypeError('bad argument: callback')
  }
  return true
}

const instance = new Process()
const queueMicrotask = (task) => process._queueMicrotask(task)

global.process = instance
global.queueMicrotask = queueMicrotask

export { instance as process, queueMicrotask }
export default instance
