/* Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

  for (var i = 1; i < args.length; ++i) {
    var source = args[i];
    if (!isNullOrUndefined(source)) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          target[prop] = source[prop];
        }
      }
    }
  }

  return target;
}

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
  var arg_string;
  var str = '';
  var start = 0;
  var end = 0;

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
  var num = Number(value);
  return isNaN(num) ? default_value : num;
}


const errnoException = (err, syscall, original) => {
  var errname = 'error'; // uv.errname(err);
  var message = syscall + ' ' + errname;

  if (original)
    message += ' ' + original;

  var e = new Error(message);
  e.code = errname;
  e.errno = errname;
  e.syscall = syscall;

  return e;
}


const exceptionWithHostPort = (err, syscall, address, port, additional) => {
  var details;
  if (port && port > 0) {
    details = address + ':' + port;
  } else {
    details = address;
  }

  if (additional) {
    details += ' - Local (' + additional + ')';
  }

  var ex = errnoException(err, syscall, details);
  ex.address = address;
  if (port) {
    ex.port = port;
  }

  return ex;
}

const { isBuffer } = Buffer
const { isArray } = Array

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
  format
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
  format
}
