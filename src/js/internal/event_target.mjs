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
import { performance } from 'perf_hooks'
import { validateObject } from 'internal/validators'
import { codes } from 'internal/errors'

const {
  ERR_INVALID_ARG_TYPE,
  ERR_EVENT_RECURSION,
  ERR_MISSING_ARGS,
  ERR_INVALID_THIS,
} = codes
const { now } = performance

const kIsEventTarget = Symbol.for('nodejs.event_target');
const kEvents = Symbol('kEvents');
const kIsBeingDispatched = Symbol('kIsBeingDispatched');
const kStop = Symbol('kStop');
const kTarget = Symbol('kTarget');
const kWeakHandler = Symbol('kWeak');
const kHybridDispatch = Symbol.for('nodejs.internal.kHybridDispatch');
const kCreateEvent = Symbol('kCreateEvent');
const kNewListener = Symbol('kNewListener');
const kRemoveListener = Symbol('kRemoveListener');
const kIsNodeStyleListener = Symbol('kIsNodeStyleListener');
const kTrustEvent = Symbol('kTrustEvent');
const kType = Symbol('type');
const kMaxEventTargetListeners = Symbol('events.maxEventTargetListeners');
const kMaxEventTargetListenersWarned = Symbol('events.maxEventTargetListenersWarned');

const isTrustedSet = new WeakSet();
const isTrusted = Object.getOwnPropertyDescriptor({
  get isTrusted() {
    return isTrustedSet.has(this);
  }
}, 'isTrusted').get;

const kEnumerableProperty = Object.freeze({
  enumerable: true
});

const kValidateObjectOptions = {
  allowArray: true, allowFunction: true, nullable: true,
}

const checkInstanceOfEvent = (instance) => {
  if (typeof instance?.[kType] !== 'string') {
    throw new ERR_INVALID_THIS('Event')
  }
}

class Event {
  _cancelable = false;
  _bubbles = false;
  _composed = false;
  _defaultPrevented = false;
  _timestamp = now();
  _propagationStopped = false;

  /**
   * @param {string} type
   * @param {{
   *   bubbles?: boolean,
   *   cancelable?: boolean,
   *   composed?: boolean,
   * }} [options]
   */
  constructor(type, options = null) {
    if (arguments.length === 0)
      throw new ERR_MISSING_ARGS('type');
    validateObject(options, 'options', kValidateObjectOptions);
    const { cancelable, bubbles, composed } = { ...options };
    this._cancelable = !!cancelable;
    this._bubbles = !!bubbles;
    this._composed = !!composed;

    this[kType] = `${type}`;
    if (options?.[kTrustEvent]) {
      isTrustedSet.add(this);
    }

    // isTrusted is special (LegacyUnforgeable)
    Object.defineProperty(this, 'isTrusted', {
      get: isTrusted,
      enumerable: true,
      configurable: false
    });
    this[kTarget] = null;
    this[kIsBeingDispatched] = false;
  }

  // TODO: veil does not support insect()
  // [customInspectSymbol](depth, options) {
  //   if (!isEvent(this))
  //     throw new ERR_INVALID_THIS('Event');
  //   const name = this.constructor.name;
  //   if (depth < 0)
  //     return name;
  //
  //   const opts = ObjectAssign({}, options, {
  //     depth: NumberIsInteger(options.depth) ? options.depth - 1 : options.depth
  //   });
  //
  //   return `${name} ${inspect({
  //     type: this[kType],
  //     defaultPrevented: this._defaultPrevented,
  //     cancelable: this._cancelable,
  //     timeStamp: this._timestamp,
  //   }, opts)}`;
  // }

  stopImmediatePropagation() {
    checkInstanceOfEvent(this)
    this[kStop] = true;
  }

  preventDefault() {
    checkInstanceOfEvent(this)
    this._defaultPrevented = true;
  }

  /**
   * @type {EventTarget}
   */
  get target() {
    checkInstanceOfEvent(this)
    return this[kTarget];
  }

  /**
   * @type {EventTarget}
   */
  get currentTarget() {
    checkInstanceOfEvent(this)
    return this[kTarget];
  }

  /**
   * @type {EventTarget}
   */
  get srcElement() {
    checkInstanceOfEvent(this)
    return this[kTarget];
  }

  /**
   * @type {string}
   */
  get type() {
    checkInstanceOfEvent(this)
    return this[kType];
  }

  /**
   * @type {boolean}
   */
  get cancelable() {
    checkInstanceOfEvent(this)
    return this._cancelable;
  }

  /**
   * @type {boolean}
   */
  get defaultPrevented() {
    checkInstanceOfEvent(this)
    return this._cancelable && this._defaultPrevented;
  }

  /**
   * @type {number}
   */
  get timeStamp() {
    checkInstanceOfEvent(this)
    return this._timestamp;
  }


  // The following are non-op and unused properties/methods from Web API Event.
  // These are not supported in Node.js and are provided purely for
  // API completeness.
  /**
   * @returns {EventTarget[]}
   */
  composedPath() {
    checkInstanceOfEvent(this)
    return this[kIsBeingDispatched] ? [this[kTarget]] : [];
  }

  /**
   * @type {boolean}
   */
  get returnValue() {
    checkInstanceOfEvent(this)
    return !this.defaultPrevented;
  }

  /**
   * @type {boolean}
   */
  get bubbles() {
    checkInstanceOfEvent(this)
    return this._bubbles;
  }

  /**
   * @type {boolean}
   */
  get composed() {
    checkInstanceOfEvent(this)
    return this._composed;
  }

  /**
   * @type {number}
   */
  get eventPhase() {
    checkInstanceOfEvent(this)
    return this[kIsBeingDispatched] ? Event.AT_TARGET : Event.NONE;
  }

  /**
   * @type {boolean}
   */
  get cancelBubble() {
    checkInstanceOfEvent(this)
    return this._propagationStopped;
  }

  /**
   * @type {boolean}
   */
  set cancelBubble(value) {
    checkInstanceOfEvent(this)
    if (value) {
      this.stopPropagation();
    }
  }

  stopPropagation() {
    checkInstanceOfEvent(this)
    this._propagationStopped = true;
  }

  static NONE = 0;
  static CAPTURING_PHASE = 1;
  static AT_TARGET = 2;
  static BUBBLING_PHASE = 3;
}

Object.defineProperties(
  Event.prototype, {
    [Symbol.toStringTag]: {
      writable: false,
      enumerable: false,
      configurable: true,
      value: 'Event',
    },
    stopImmediatePropagation: kEnumerableProperty,
    preventDefault: kEnumerableProperty,
    target: kEnumerableProperty,
    currentTarget: kEnumerableProperty,
    srcElement: kEnumerableProperty,
    type: kEnumerableProperty,
    cancelable: kEnumerableProperty,
    defaultPrevented: kEnumerableProperty,
    timeStamp: kEnumerableProperty,
    composedPath: kEnumerableProperty,
    returnValue: kEnumerableProperty,
    bubbles: kEnumerableProperty,
    composed: kEnumerableProperty,
    eventPhase: kEnumerableProperty,
    cancelBubble: kEnumerableProperty,
    stopPropagation: kEnumerableProperty,
  });

class NodeCustomEvent extends Event {
  constructor(type, options) {
    super(type, options);
    this.detail = options?.detail;
  }
}

// The listeners for an EventTarget are maintained as a linked list.
// Unfortunately, the way EventTarget is defined, listeners are accounted
// using the tuple [handler,capture], and even if we don't actually make
// use of capture or bubbling, in order to be spec compliant we have to
// take on the additional complexity of supporting it. Fortunately, using
// the linked list makes dispatching faster, even if adding/removing is
// slower.
class Listener {
  constructor(previous, listener, once, capture, passive,
    isNodeStyleListener, weak) {
    if (weak) {
      throw Error('weak not supported')
    }
    this.next = undefined;
    if (previous !== undefined)
      previous.next = this;
    this.previous = previous;
    this.listener = listener;
    // TODO(benjamingr) these 4 can be 'flags' to save 3 slots
    this.once = once;
    this.capture = capture;
    this.passive = passive;
    this.isNodeStyleListener = isNodeStyleListener;
    this.removed = false;

    if (typeof listener === 'function') {
      this.callback = listener;
      this.listener = listener;
    } else {
      this.callback = listener.handleEvent.bind(listener);
      this.listener = listener;
    }
  }

  same(listener, capture) {
    const myListener = this.listener;
    return myListener === listener && this.capture === capture;
  }

  remove() {
    if (this.previous !== undefined)
      this.previous.next = this.next;
    if (this.next !== undefined)
      this.next.previous = this.previous;
    this.removed = true;
  }
}

const checkInstanceOfEventTarget = (self) => {
  if (!self?.constructor?.[kIsEventTarget]) {
    throw new ERR_INVALID_THIS('EventTarget')
  }
}

class EventTarget {
  // Used in checking whether an object is an EventTarget. This is a well-known
  // symbol as EventTarget may be used cross-realm.
  // Ref: https://github.com/nodejs/node/pull/33661
  static [kIsEventTarget] = true;

  [kEvents] = new Map();
  [kMaxEventTargetListeners] = EventEmitter.defaultMaxListeners;
  [kMaxEventTargetListenersWarned] = false;

  [kNewListener](size, type, listener, once, capture, passive, weak) {
    if (this[kMaxEventTargetListeners] > 0 &&
      size > this[kMaxEventTargetListeners] &&
      !this[kMaxEventTargetListenersWarned]) {
      this[kMaxEventTargetListenersWarned] = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      const w = new Error('Possible EventTarget memory leak detected. ' +
        `${size} ${type} listeners ` +
        `added to ${this.toString()}. Use ` +
        'events.setMaxListeners() to increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.target = this;
      w.type = type;
      w.count = size;
      process.emitWarning(w);
    }
  }
  [kRemoveListener](size, type, listener, capture) {}

  /**
   * @callback EventTargetCallback
   * @param {Event} event
   */

  /**
   * @typedef {{ handleEvent: EventTargetCallback }} EventListener
   */

  /**
   * @param {string} type
   * @param {EventTargetCallback|EventListener} listener
   * @param {{
   *   capture?: boolean,
   *   once?: boolean,
   *   passive?: boolean,
   *   signal?: AbortSignal
   * }} [options]
   */
  addEventListener(type, listener, options = {}) {
    checkInstanceOfEventTarget(this)
    if (arguments.length < 2)
      throw new ERR_MISSING_ARGS('type', 'listener');

    // We validateOptions before the shouldAddListeners check because the spec
    // requires us to hit getters.
    const {
      once,
      capture,
      passive,
      signal,
      isNodeStyleListener,
      weak,
    } = validateEventListenerOptions(options);

    if (!shouldAddListener(listener)) {
      // The DOM silently allows passing undefined as a second argument
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      const w = new Error(`addEventListener called with ${listener}` +
        ' which has no effect.');
      w.name = 'AddEventListenerArgumentTypeWarning';
      w.target = this;
      w.type = type;
      process.emitWarning(w);
      return;
    }
    type = String(type);

    if (signal) {
      if (signal.aborted) {
        return;
      }
      // TODO(benjamingr) make this weak somehow? ideally the signal would
      // not prevent the event target from GC.
      signal.addEventListener('abort', () => {
        this.removeEventListener(type, listener, options);
      }, { once: true, [kWeakHandler]: this });
    }

    let root = this[kEvents].get(type);

    if (root === undefined) {
      root = { size: 1, next: undefined };
      // This is the first handler in our linked list.
      new Listener(root, listener, once, capture, passive,
        isNodeStyleListener, weak);
      this[kNewListener](
        root.size,
        type,
        listener,
        once,
        capture,
        passive,
        weak);
      this[kEvents].set(type, root);
      return;
    }

    let handler = root.next;
    let previous = root;

    // We have to walk the linked list to see if we have a match
    while (handler !== undefined && !handler.same(listener, capture)) {
      previous = handler;
      handler = handler.next;
    }

    if (handler !== undefined) { // Duplicate! Ignore
      return;
    }

    new Listener(previous, listener, once, capture, passive,
      isNodeStyleListener, weak);
    root.size++;
    this[kNewListener](root.size, type, listener, once, capture, passive, weak);
  }

  /**
   * @param {string} type
   * @param {EventTargetCallback|EventListener} listener
   * @param {{
   *   capture?: boolean,
   * }} [options]
   */
  removeEventListener(type, listener, options = {}) {
    checkInstanceOfEventTarget(this)
    if (!shouldAddListener(listener))
      return;

    type = String(type);
    const capture = options?.capture === true;

    const root = this[kEvents].get(type);
    if (root === undefined || root.next === undefined)
      return;

    let handler = root.next;
    while (handler !== undefined) {
      if (handler.same(listener, capture)) {
        handler.remove();
        root.size--;
        if (root.size === 0)
          this[kEvents].delete(type);
        this[kRemoveListener](root.size, type, listener, capture);
        break;
      }
      handler = handler.next;
    }
  }

  /**
   * @param {Event} event
   */
  dispatchEvent(event) {
    checkInstanceOfEventTarget(this)

    if (!(event instanceof Event))
      throw new ERR_INVALID_ARG_TYPE('event', 'Event', event);

    if (event[kIsBeingDispatched])
      throw new ERR_EVENT_RECURSION(event.type);

    this[kHybridDispatch](event, event.type, event);

    return event.defaultPrevented !== true;
  }

  [kHybridDispatch](nodeValue, type, event) {
    const createEvent = () => {
      if (event === undefined) {
        event = this[kCreateEvent](nodeValue, type);
        event[kTarget] = this;
        event[kIsBeingDispatched] = true;
      }
      return event;
    };
    if (event !== undefined) {
      event[kTarget] = this;
      event[kIsBeingDispatched] = true;
    }

    const root = this[kEvents].get(type);
    if (root === undefined || root.next === undefined) {
      if (event !== undefined)
        event[kIsBeingDispatched] = false;
      return true;
    }

    let handler = root.next;
    let next;

    while (handler !== undefined &&
    (handler.passive || event?.[kStop] !== true)) {
      // Cache the next item in case this iteration removes the current one
      next = handler.next;

      if (handler.removed) {
        // Deal with the case an event is removed while event handlers are
        // Being processed (removeEventListener called from a listener)
        handler = next;
        continue;
      }
      if (handler.once) {
        handler.remove();
        root.size--;
        const { listener, capture } = handler;
        this[kRemoveListener](root.size, type, listener, capture);
      }

      try {
        let arg;
        if (handler.isNodeStyleListener) {
          arg = nodeValue;
        } else {
          arg = createEvent();
        }
        const callback = handler.weak ?
          handler.callback.deref() : handler.callback;
        let result;
        if (callback) {
          result = callback.call(this, arg);
          if (!handler.isNodeStyleListener) {
            arg[kIsBeingDispatched] = false;
          }
        }
        if (result !== undefined && result !== null) {
          const { then } = result;
          if (typeof then === 'function') {
            // The callback is called with nextTick to avoid a follow-up
            // rejection from this promise.
            then.call(promise, undefined, emitUncaughtException);
          }
        }
      } catch (err) {
        emitUncaughtException(err);
      }

      handler = next;
    }

    if (event !== undefined)
      event[kIsBeingDispatched] = false;
  }

  [kCreateEvent](nodeValue, type) {
    return new NodeCustomEvent(type, { detail: nodeValue });
  }

  // TODO: veil does not support inspect
  // [customInspectSymbol](depth, options) {
  //   if (!isEventTarget(this))
  //     throw new ERR_INVALID_THIS('EventTarget');
  //   const name = this.constructor.name;
  //   if (depth < 0)
  //     return name;
  //
  //   const opts = ObjectAssign({}, options, {
  //     depth: NumberIsInteger(options.depth) ? options.depth - 1 : options.depth
  //   });
  //
  //   return `${name} ${inspect({}, opts)}`;
  // }
}

Object.defineProperties(EventTarget.prototype, {
  addEventListener: kEnumerableProperty,
  removeEventListener: kEnumerableProperty,
  dispatchEvent: kEnumerableProperty,
  [Symbol.toStringTag]: {
    writable: false,
    enumerable: false,
    configurable: true,
    value: 'EventTarget',
  }
});

function shouldAddListener(listener) {
  if (typeof listener === 'function' ||
    typeof listener?.handleEvent === 'function') {
    return true;
  }

  if (listener == null)
    return false;

  throw new ERR_INVALID_ARG_TYPE('listener', 'EventListener', listener);
}

function validateEventListenerOptions(options) {
  if (typeof options === 'boolean')
    return { capture: options };

  if (options === null)
    return {};
  validateObject(options, 'options', {
    allowArray: true, allowFunction: true,
  });
  return {
    once: Boolean(options.once),
    capture: Boolean(options.capture),
    passive: Boolean(options.passive),
    signal: options.signal,
    weak: options[kWeakHandler],
    isNodeStyleListener: Boolean(options[kIsNodeStyleListener])
  };
}

const emitUncaughtException = (err) => process.nextTick(() => { throw err; })

Object.assign(global, { Event, EventTarget })

export default { Event, EventTarget }

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
