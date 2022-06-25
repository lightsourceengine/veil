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

const ErrorClass = (code, base, messageOrFunc) => {
  if (typeof messageOrFunc === 'string') {
    return class extends base {
      code = code
      message = messageOrFunc
    }
  }

  return class extends base {
    code = code
    constructor (...args) {
      super()
      this.message = messageOrFunc(this, ...args)
    }
  }
}

export const ERR_INVALID_URI = ErrorClass('ERR_INVALID_URI', URIError, 'URI malformed')

export const ERR_EVENT_RECURSION = ErrorClass('ERR_EVENT_RECURSION', Error, (self, arg) => `The event "${arg}" is already being dispatched`)

export const ERR_INVALID_ARG_TYPE = ErrorClass(
  'ERR_INVALID_ARG_TYPE',
  Error,
  (self, name, expected, actual) => `The ${name} argument must be of type ${expected}. Received ${typeof actual}`)

export const ERR_ARG_NOT_ITERABLE = ErrorClass(
  'ERR_ARG_NOT_ITERABLE',
  TypeError,
  (self, arg) => `${arg} must be iterable`
)

export const ERR_INVALID_ARG_VALUE = ErrorClass(
  'ERR_INVALID_ARG_VALUE',
  TypeError,
  (self, name, value, reason = 'is invalid') => `The ${name.includes('.') ? 'property' : 'argument'} '${name}' ${reason}. Received ${typeof value}`
)

export const ERR_INVALID_FILE_URL_HOST = ErrorClass(
  'ERR_INVALID_FILE_URL_HOST',
  TypeError,
  (self, arg) => `File URL host must be "localhost" or empty on ${arg}`
)

export const ERR_INVALID_FILE_URL_PATH = ErrorClass(
  'ERR_INVALID_FILE_URL_PATH',
  TypeError,
  (self, arg) => `File URL path ${arg}`
)

export const ERR_INVALID_THIS = ErrorClass(
  'ERR_INVALID_THIS',
  TypeError,
  (self, arg) => `Value of "this" must be of type ${arg}`
)

export const ERR_INVALID_TUPLE = ErrorClass(
  'ERR_INVALID_TUPLE',
  TypeError,
  (self, ...args) => `${args[0]} must be an iterable ${args[1]} tuple`
)

export const ERR_INVALID_URL = ErrorClass(
  'ERR_INVALID_URL',
  TypeError,
  (self, input) => {
    // Don't include URL in message.
    // (See https://github.com/nodejs/node/pull/38614)
    self.input = input
    return 'Invalid URL'
  }
)

export const ERR_INVALID_URL_SCHEME = ErrorClass(
  'ERR_INVALID_URL_SCHEME',
  TypeError,
  (self, expected) => {
    if (typeof expected === 'string') {
      expected = [expected];
    }
    if (expected.length > 2) {
      return 'assert: expected.length <= 2'
    }
    const res = expected.length === 2 ?
      `one of scheme ${expected[0]} or ${expected[1]}` :
      `of scheme ${expected[0]}`;
    return `The URL must be ${res}`;
  }
)

export const ERR_MISSING_ARGS = ErrorClass(
  'ERR_MISSING_ARGS',
  TypeError,
  (self, ...args) => {
    const { length } = args
    if (!length) {
      return 'assert: At least one arg needs to be specified'
    }
    let msg = 'The ';
    const len = length;
    const wrap = (a) => `"${a}"`;
    args = args.map((a) => (Array.isArray(a) ? a.map(wrap).join(' or ') : wrap(a)));
    switch (len) {
      case 1:
        msg += `${args[0]} argument`;
        break;
      case 2:
        msg += `${args[0]} and ${args[1]} arguments`;
        break;
      default:
        msg += args.slice(0, len - 1).join(', ');
        msg += `, and ${args[len - 1]} arguments`;
        break;
    }
    return `${msg} must be specified`;
  }
)

export const ERR_UNHANDLED_ERROR = ErrorClass(
  'ERR_UNHANDLED_ERROR',
  Error,
  (self, err = undefined) => {
    const msg = 'Unhandled error.';
    return (err === undefined) ? msg : `${msg} (${err})`;
  }
)

export const ERR_OUT_OF_RANGE = ErrorClass(
  'ERR_OUT_OF_RANGE',
  RangeError,
  (self, str, range, input, replaceDefaultBoolean = false) => {
    if (!range) {
      throw new ERR_MISSING_ARGS('range')
    }
    let msg = replaceDefaultBoolean ? str :
      `The value of "${str}" is out of range.`;
    let received;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === 'bigint') {
      received = String(input);
      if (input > 2n ** 32n || input < -(2n ** 32n)) {
        received = addNumericalSeparator(received);
      }
      received += 'n';
    } else {
      received = input;
    }
    msg += ` It must be ${range}. Received ${received}`;
    return msg;
  }
)

// Only use this for integers! Decimal numbers do not work with this function.
const addNumericalSeparator = (val) => {
  let res = '';
  let i = val.length;
  const start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`;
  }
  return `${val.slice(0, i)}${res}`;
}
