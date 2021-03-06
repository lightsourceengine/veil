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

const { native } = import.meta
const TIMEOUT_MAX = '2147483647.0' - 0; // 2^31-1

const TIMER_TYPES = {
  setTimeout: 0,
  setInterval: 1,
  setImmediate: 2,
};


function Timeout(after) {
  this.after = after;
  this.isRepeat = false;
  this.callback = null;
  this.handler = null;
}


native.prototype.handleTimeout = function() {
  var timeout = this.timeoutObj; // 'this' is native object
  if (timeout && timeout.callback) {
    try {
      timeout.callback();
    } catch (e) {
      timeout.unref();
      throw e;
    }

    if (!timeout.isRepeat) {
      timeout.unref();
    }
  }
};


Timeout.prototype.ref = function() {
  var repeat = 0;
  var handler = new native();

  if (this.isRepeat) {
    repeat = this.after;

  }

  handler.timeoutObj = this;
  this.handler = handler;

  handler.start(this.after, repeat);
};


Timeout.prototype.unref = function() {
  this.callback = undefined;
  if (this.handler) {
    this.handler.timeoutObj = undefined;
    this.handler.stop();
    this.handler = undefined;
  }
};


function timeoutConfigurator(type, callback, delay, ...args) {
  if (typeof callback !== 'function') {
    throw new TypeError('Bad arguments: callback must be a Function');
  }

  if (type === TIMER_TYPES.setImmediate) {
    delay = 0;
  } else {
    delay *= 1;
    if (delay < 1 || delay > TIMEOUT_MAX) {
      delay = 1;
    }
  }

  const timeout = new Timeout(delay);

  // set timeout handler.
  if (args.length === 0) {
    timeout.callback = callback;
  } else {
    // TODO: arg stuff seems sus
    timeout.callback = callback.bind.apply(callback, [timeout, ...args.slice(3)]);
  }
  timeout.isRepeat = type === TIMER_TYPES.setInterval;
  timeout.ref();

  return timeout;
}

const setTimeout = timeoutConfigurator.bind(undefined, TIMER_TYPES.setTimeout)
const setInterval = timeoutConfigurator.bind(undefined, TIMER_TYPES.setInterval)
const setImmediate = timeoutConfigurator.bind(undefined, TIMER_TYPES.setImmediate)
const clearTimeout = (timeout) => timeout instanceof Timeout && timeout.unref()
const clearInterval = (timeout) => timeout instanceof Timeout && timeout.unref()
const clearImmediate = (timeout) => timeout instanceof Timeout && timeout.unref()

Object.assign(global, {
  setTimeout,
  setInterval,
  setImmediate,
  clearTimeout,
  clearInterval,
  clearImmediate
})

export {
  setTimeout,
  setInterval,
  setImmediate,
  clearTimeout,
  clearInterval,
  clearImmediate
}

export default {
  setTimeout,
  setInterval,
  setImmediate,
  clearTimeout,
  clearInterval,
  clearImmediate
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
