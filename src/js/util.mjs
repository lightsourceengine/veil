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

import { validateFunction } from './internal/validators.mjs'

const { errname, errmessage, toUSVString } = import.meta.native

const isNull = (arg) => {
  return arg === null;
}

const isUndefined = (arg) => {
  return arg === undefined;
}


const isNullOrUndefined = (arg) => {
  return arg === null || arg === undefined;
}


const isNumber = (arg) => {
  return typeof arg === 'number';
}

const isFinite = (arg) => {
  return (arg === 0) || (arg !== arg / 2);
}

const isBoolean = (arg) => {
  return typeof arg === 'boolean';
}


const isString = (arg) => {
  return typeof arg === 'string';
}


const isObject = (arg) => {
  return typeof arg === 'object' && arg != null;
}


const isFunction = (arg) => {
  return typeof arg === 'function';
}


const inherits = (ctor, superCtor) => {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
}


const mixin = (...args) => {
  const [ target ] = args

  if (isNullOrUndefined(target)) {
    throw new TypeError('target cannot be null or undefined');
  }

  for (let i = 1; i < args.length; ++i) {
    const source = args[i];
    if (!isNullOrUndefined(source)) {
      for (const prop in source) {
        if (source.hasOwnProperty(prop)) {
          target[prop] = source[prop];
        }
      }
    }
  }

  return target;
}

const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs');

const promisify = (original) => {
  let fn

  validateFunction(original, 'original');

  if (original[kCustomPromisifiedSymbol]) {
    fn = original[kCustomPromisifiedSymbol];

    validateFunction(fn, 'util.promisify.custom');

    return Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['bytesRead', 'buffer'] for fs.read.
  const argumentNames = original[kCustomPromisifyArgsSymbol];

  fn = function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (argumentNames !== undefined && values.length > 1) {
          const obj = {};
          for (let i = 0; i < argumentNames.length; i++)
            obj[argumentNames[i]] = values[i];
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
      Reflect.apply(original, this, args);
    })
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    Object.getOwnPropertyDescriptors(original)
  );
}

promisify.custom = kCustomPromisifiedSymbol;

const format = (...args) => {
  const [s] = args

  if (typeof s === 'string') {
    if (s.includes('%')) {
      // fall through to format
    } else if (args.length === 1) {
      return s
    } else {
      return args.map(formatValue).join(' ')
    }
  } else {
    if (args.length === 0) {
      return ''
    } else if (args.length === 1) {
      return formatValue(s)
    } else {
      return args.map(formatValue).join(' ')
    }
  }

  let i = 1;
  let arg_string;
  let str = '';
  let start = 0;
  let end = 0;

  while (end < s.length) {
    if (s.charAt(end) !== '%') {
      end++;
      continue;
    }

    str += s.slice(start, end);

    switch (s.charAt(end + 1)) {
      case 's':
        arg_string = String(args[i]);
        break;
      case 'd':
        arg_string = Number(args[i]);
        break;
      case 'j':
        try {
          arg_string = JSON.stringify(args[i]);
        } catch (_) {
          arg_string = '[Circular]';
        }
        break;
      case '%':
        str += '%';
        start = end = end + 2;
        continue;
      default:
        str = str + '%' + s.charAt(end + 1);
        start = end = end + 2;
        continue;
    }

    if (i >= args.length) {
      str = str + '%' + s.charAt(end + 1);
    } else {
      i++;
      str += arg_string;
    }

    start = end = end + 2;
  }

  str += s.slice(start, end);

  while (i < args.length) {
    str += ' ' + formatValue(args[i++]);
  }

  return str;
}

const formatValue = (v) => {
  if (!v) {
    return String(v)
  } else if (Array.isArray(v)) {
    return `[${v.toString()}]`;
  } else if (v instanceof Error) {
    const { message, stack } = v;
    const result = v.code ? `Error [${v.code}]: ${message}` : `Error: ${message}`

    if (Array.isArray(stack)) {
      return result + '\n' + stack.map(line => `    at ${line}`).join('\n')
    }

    return result;
  } else if (typeof v === 'object') {
    return JSON.stringify(v, null, 2);
  } else {
    return v.toString();
  }
}


const stringToNumber = (value, default_value) => {
  const num = Number(value);
  return isNaN(num) ? default_value : num;
}


const errnoException = (err, syscall, original) => {
  const name = errname(err);
  const message = errmessage(err);
  const e = Error(original ? `${message} ${original}` : message);

  e.code = name;
  e.errno = name;
  e.syscall = syscall;

  return e;
}


const exceptionWithHostPort = (err, syscall, address, port, additional) => {
  const hasPort = (port | 0) > 0
  const details = hasPort ? `${address}:${port}`: address
  const ex = errnoException(err, syscall, additional ? `${details} - Local (${additional})` : details);

  ex.address = address;

  if (hasPort) {
    ex.port = port;
  }

  return ex;
}

const { isBuffer } = Buffer
const { isArray } = Array

const types = {
  isPromise: (p) => p && Object.prototype.toString.call(p) === '[object Promise]'
}

export {
  isNull,
  isUndefined,
  isNullOrUndefined,
  isNumber,
  isBoolean,
  isString,
  isObject,
  isFinite,
  isFunction,
  isBuffer,
  isArray,
  exceptionWithHostPort,
  errnoException,
  stringToNumber,
  inherits,
  mixin,
  format,
  types,
  promisify,
  toUSVString
}

export default {
  isNull,
  isUndefined,
  isNullOrUndefined,
  isNumber,
  isBoolean,
  isString,
  isObject,
  isFinite,
  isFunction,
  isBuffer,
  isArray,
  exceptionWithHostPort,
  errnoException,
  stringToNumber,
  inherits,
  mixin,
  format,
  types,
  promisify,
  toUSVString
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
