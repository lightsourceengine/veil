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

import { validateFunction, validateBoolean } from './internal/validators.mjs'
import { ERR_UNHANDLED_ERROR, ERR_OUT_OF_RANGE } from './internal/errors.mjs'

const kCapture = Symbol('kCapture');
const kErrorMonitor = Symbol('events.errorMonitor');
const kRejection = Symbol.for('nodejs.rejection');
const emptyObject = Object.freeze({})

let defaultMaxListeners = 10;

class EventEmitter {
  static defaultMaxListeners = defaultMaxListeners;

  [kCapture] = false;
  [kRejection] = null
  _events = {}
  _eventsCount = 0
  _maxListeners

  constructor (opts = undefined) {
    const captureRejections = opts?.captureRejections

    if (captureRejections) {
      validateBoolean(captureRejections, 'options.captureRejections');
      this[kCapture] = Boolean(captureRejections);
    }
  }

  addListener(eventName, listener) {
    return addListener(this, eventName, listener, false)
  }

  emit(eventName, ...args) {
    let doError = (eventName === 'error');

    const events = this._events;
    if (events !== undefined) {
      if (doError && events[kErrorMonitor] !== undefined)
        this.emit(kErrorMonitor, ...args);
      doError = (doError && events.error === undefined);
    } else if (!doError)
      return false;

    // If there is no 'error' event listener then throw.
    if (doError) {
      let er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        // TODO: veil does not support enhanced error info
        // try {
        //   const capture = {};
        //   ErrorCaptureStackTrace(capture, EventEmitter.prototype.emit);
        //   ObjectDefineProperty(er, kEnhanceStackBeforeInspector, {
        //     value: FunctionPrototypeBind(enhanceStackTrace, this, er, capture),
        //     configurable: true
        //   });
        // } catch {
        //   // Continue regardless of error.
        // }

        // Note: The comments on the `throw` lines are intentional, they show
        // up in Node's output if this results in an unhandled exception.
        throw er; // Unhandled 'error' event
      }

      // At least give some kind of context to the user
      const err = new ERR_UNHANDLED_ERROR(er);
      err.context = er;
      throw err; // Unhandled 'error' event
    }

    const handler = events[eventName];

    if (handler === undefined)
      return false;

    if (typeof handler === 'function') {
      const result = handler.apply(this, args);

      // We check if result is undefined first because that
      // is the most common case so we do not pay any perf
      // penalty
      if (result !== undefined && result !== null) {
        addCatch(this, result, eventName, args);
      }
    } else {
      const len = handler.length;
      const listeners = [ ...handler ];
      for (let i = 0; i < len; ++i) {
        const result = listeners[i].apply(this, args);

        // We check if result is undefined first because that
        // is the most common case so we do not pay any perf
        // penalty.
        // This code is duplicated because extracting it away
        // would make it non-inlineable.
        if (result !== undefined && result !== null) {
          addCatch(this, result, eventName, args);
        }
      }
    }

    return true;
  }

  eventNames() {
    return Reflect.ownKeys(this._events || emptyObject)
  }

  getMaxListeners() {
    const { _maxListeners } = this
    return _maxListeners === undefined ? EventEmitter.defaultMaxListeners : _maxListeners
  }

  listenerCount(eventName) {
    const evlistener = this._events?.[eventName]

    if (typeof evlistener === 'function') {
      return 1
    }

    return evlistener?.length ?? 0
  }

  listeners(eventName) {
    return listListeners(this, eventName, false)
  }

  off(eventName, listener) {
    return removeListener(this, eventName, listener)
  }

  on(eventName, listener) {
    return addListener(this, eventName, listener, false)
  }

  once(eventName, listener) {
    checkListener(listener);
    return this.on(eventName, onceWrap(this, eventName, listener))
  }

  prependListener(eventName, listener) {
    return addListener(this, eventName, listener, true)
  }

  prependOnceListener(eventName, listener) {
    checkListener(listener);
    return this.prependListener(eventName, onceWrap(this, eventName, listener))
  }

  removeAllListeners(eventName = undefined) {
    const removeAll = eventName === undefined
    const events = this._events;

    if (events === undefined)
      return this;

    // Not listening for removeListener, no need to emit
    if (!events.removeListener) {
      if (removeAll) {
        this._events = {};
        this._eventsCount = 0;
      } else if (events[eventName]) {
        if (--this._eventsCount === 0)
          this._events = {};
        else
          delete events[eventName];
      }
      return this;
    }

    // Emit removeListener for all listeners on all events
    if (removeAll) {
      for (const key of Reflect.ownKeys(events)) {
        if (key !== 'removeListener')
          this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = {};
      this._eventsCount = 0;
      return this;
    }

    const listeners = events[eventName];

    if (typeof listeners === 'function') {
      this.removeListener(eventName, listeners);
    } else if (listeners) {
      // LIFO order
      for (let i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(eventName, listeners[i]);
      }
    }

    return this;
  }

  removeListener(eventName, listener) {
    return removeListener(this, eventName, listener)
  }

  setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
      throw new ERR_OUT_OF_RANGE('n', 'a non-negative number', n);
    }
    this._maxListeners = n;
    return this;
  }

  rawListeners(eventName) {
    return listListeners(this, eventName, false)
  }
}

const addListener = (target, type, listener, prepend) => {
  let events;
  let existing;

  checkListener(listener);

  events = target._events;
  if (!events) {
    events = target._events = {};
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type, listener.listener ?? listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    const maxListeners = target.getMaxListeners();
    if (maxListeners > 0 && existing.length > maxListeners && !existing.warned) {
      existing.warned = true;
      process.emitWarning(`Possible EventEmitter memory leak detected. ${existing.length} ${String(type)} listeners added to EventEmitter.`);
    }
  }

  return target;
}

const listListeners = (target, type, unwrap) => {
  const evlistener = target._events?.[type]

  if (!evlistener) {
    return []
  }

  if (typeof evlistener === 'function') {
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  }

  return unwrap ? evlistener.map(l => l.listener || l) : [ ...evlistener ];
}

const onceWrap = (target, type, listener) => {
  let fired = false

  const wrapped = (...args) => {
    if (!fired) {
      target.removeListener(type, wrapped)
      fired = true
      return listener.apply(target, args)
    }
  }

  return wrapped
}

const removeListener = (target, type, listener) => {
  checkListener(listener);

  const events = target._events;
  if (events === undefined)
    return target;

  const list = events[type];
  if (list === undefined)
    return target;

  if (list === listener || list.listener === listener) {
    if (--target._eventsCount === 0)
      target._events = {};
    else {
      delete events[type];
      if (events.removeListener)
        target.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    let position = -1;

    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return target;

    if (position === 0)
      list.shift();
    else
      spliceOne(list, position);

    if (list.length === 1)
      events[type] = list[0];

    if (events.removeListener)
      target.emit('removeListener', type, listener);
  }

  return target;
}

const addCatch = (that, promise, type, args) => {
  if (!that[kCapture]) {
    return;
  }

  // Handle Promises/A+ spec, then could be a getter
  // that throws on second use.
  try {
    const { then } = promise

    if (typeof then === 'function') {
      // The callback is called with nextTick to avoid a follow-up
      // rejection from this promise.
      then.call(
        promise,
        undefined,
        (err) => process.nextTick(emitUnhandledRejectionOrErr, that, err, type, args));
    }
  } catch (err) {
    that.emit('error', err);
  }
}

const emitUnhandledRejectionOrErr = (ee, err, type, args) => {
  if (typeof ee[kRejection] === 'function') {
    ee[kRejection](err, type, ...args);
  } else {
    // We have to disable the capture rejections mechanism, otherwise
    // we might end up in an infinite loop.
    const prev = ee[kCapture];

    // If the error handler throws, it is not catchable and it
    // will end up in 'uncaughtException'. We restore the previous
    // value of kCapture in case the uncaughtException is present
    // and the exception is handled.
    try {
      ee[kCapture] = false;
      ee.emit('error', err);
    } finally {
      ee[kCapture] = prev;
    }
  }
}

const checkListener = (listener) => validateFunction(listener, 'listener')

// As of V8 6.6, depending on the size of the array, this is anywhere
// between 1.5-10x faster than the two-arg version of Array#splice()
const spliceOne = (list, index) => {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

export default EventEmitter;
export { EventEmitter, kRejection as captureRejectionSymbol, kErrorMonitor as errorMonitor };

/* Retained copyright notices: */

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
