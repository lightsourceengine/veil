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

export const codes = {}

const ETypeError = TypeError
const EURIError = URIError
const ERangeError = RangeError

const E = (code, messageOrFunc, base = Error) => {
  if (typeof messageOrFunc === 'string') {
    messageOrFunc = (self) => messageOrFunc
  }

  codes[code] = class code extends base {
    code = code
    constructor (...args) {
      super()
      this.message = messageOrFunc(this, ...args)
    }
  }
}

E('ERR_INVALID_URI', 'URI malformed', EURIError)

E('ERR_EVENT_RECURSION', (self, arg) => `The event "${arg}" is already being dispatched`)

E('ERR_IPC_ONE_PIPE', 'Child process can have only one IPC pipe');

E('ERR_IPC_SYNC_FORK', 'IPC cannot be used with synchronous forks');

E(
  'ERR_INVALID_ARG_TYPE',
  (self, name, expected, actual) => `The ${name} argument must be of type ${expected}. Received ${typeof actual}`
)

E(
  'ERR_ARG_NOT_ITERABLE',
  (self, arg) => `${arg} must be iterable`,
  ETypeError
)

E(
  'ERR_INVALID_ARG_VALUE',
  (self, name, value, reason = 'is invalid') => `The ${name.includes('.') ? 'property' : 'argument'} '${name}' ${reason}. Received ${typeof value}`,
  ETypeError
)

E(
  'ERR_INVALID_FILE_URL_HOST',
  (self, arg) => `File URL host must be "localhost" or empty on ${arg}`,
  ETypeError
)

E(
  'ERR_INVALID_FILE_URL_PATH',
  (self, arg) => `File URL path ${arg}`,
  ETypeError
)

E(
  'ERR_INVALID_THIS',
  (self, arg) => `Value of "this" must be of type ${arg}`,
  ETypeError
)

E(
  'ERR_INVALID_TUPLE',
  (self, ...args) => `${args[0]} must be an iterable ${args[1]} tuple`,
  ETypeError
)

E(
  'ERR_INVALID_URL',
  (self, input) => {
    // Don't include URL in message.
    // (See https://github.com/nodejs/node/pull/38614)
    self.input = input
    return 'Invalid URL'
  },
  ETypeError
)

E(
  'ERR_INVALID_URL_SCHEME',
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
  },
  ETypeError
)

E(
  'ERR_MISSING_ARGS',
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
  },
  ETypeError
)

E(
  'ERR_UNHANDLED_ERROR',
  (self, err = undefined) => {
    const msg = 'Unhandled error.';
    return (err === undefined) ? msg : `${msg} (${err})`;
  }
)

E(
  'ERR_OUT_OF_RANGE',
  (self, str, range, input, replaceDefaultBoolean = false) => {
    if (!range) {
      throw new codes.ERR_MISSING_ARGS('range')
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
  },
  ERangeError
)

E(
  'ERR_INVALID_SYNC_FORK_INPUT',
  (self, arg) => `Asynchronous forks do not support Buffer, TypedArray, DataView or string input: ${arg}`,
  ETypeError
)

E(
  'ERR_UNKNOWN_SIGNAL',
  (self, arg) => `Unknown signal: ${arg}`,
  ETypeError
);

E(
  'ERR_MODULE_NOT_FOUND',
  (self, search) => `Cannot find module '${search}'`
)

E(
  'ERR_INVALID_PACKAGE_CONFIG',
  (self, path, base, message) => `Invalid package config ${path}${base ? ` while importing ${base}` : ''}${message ? `. ${message}` : ''}`
);

E(
  'ERR_PACKAGE_IMPORT_NOT_DEFINED',
  (self, specifier, packagePath, base) => `Package import specifier "${specifier}" is not defined${packagePath ?
    ` in package ${packagePath}package.json` : ''} imported from ${base}`,
  ETypeError
)

E(
  'ERR_PACKAGE_PATH_NOT_EXPORTED',
  (self, pkgPath, subpath, base = undefined) => {
    if (subpath === '.')
      return `No "exports" main defined in ${pkgPath}package.json${base ?
        ` imported from ${base}` : ''}`;
    return `Package subpath '${subpath}' is not defined by "exports" in ${
      pkgPath}package.json${base ? ` imported from ${base}` : ''}`;
  }
)

E(
  'ERR_UNSUPPORTED_DIR_IMPORT',
  (self, ...args) => `Directory import '${args[0]}' is not supported resolving ES modules imported from ${args[1]}`
)

E(
  'ERR_NETWORK_IMPORT_DISALLOWED',
  (self, ...args) => `import of '${args[0]}' by ${args[1]} is not supported: ${args[2]}`
)

E(
  'ERR_UNSUPPORTED_ESM_URL_SCHEME',
  (self, url, supported) => {
    let msg = `Only URLs with a scheme in: ${supported.join(', ')} are supported by the default ESM loader`;
    if (process.platform === 'win32' && url.protocol.length === 2) {
      msg += '. On Windows, absolute paths must be valid file:// URLs';
    }
    msg += `. Received protocol '${url.protocol}'`;
    return msg;
  }
)

E(
  'ERR_INVALID_PACKAGE_TARGET',
  (self, pkgPath, key, target, isImport = false, base = undefined) => {
    const relError = typeof target === 'string' && !isImport && target.length && !target.startsWith('./');
    if (key === '.') {
      if(isImport !== false) {
        throw Error(`isImport must be false when key = '.'`)
      }
      return `Invalid "exports" main target ${JSON.stringify(target)} defined ` +
        `in the package config ${pkgPath}package.json${base ?
          ` imported from ${base}` : ''}${relError ?
          '; targets must start with "./"' : ''}`;
    }
    return `Invalid "${isImport ? 'imports' : 'exports'}" target ${
      JSON.stringify(target)} defined for '${key}' in the package config ${
      pkgPath}package.json${base ? ` imported from ${base}` : ''}${relError ?
      '; targets must start with "./"' : ''}`;
  }
)

E(
  'ERR_INVALID_MODULE_SPECIFIER',
  (self, request, reason, base = undefined) => `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ''}`,
  ETypeError
)

E(
  'ERR_UNKNOWN_FILE_EXTENSION',
  (self, ext, path, suggestion) => {
    let msg = `Unknown file extension "${ext}" for ${path}`;
    if (suggestion) {
      msg += `. ${suggestion}`;
    }
    return msg;
  },
  ETypeError
)

// TODO: this is a quick and dirty impl. NodeJS has a native map of error code -> messages
export const errnoException = (err, syscall, original) => {
  const ex = new Error(`${syscall} (${err}): ${original}`);

  ex.errno = err;
  ex.code = err.toString();
  ex.syscall = syscall;

  return ex;
}

// Node uses an AbortError that isn't exactly the same as the DOMException
// to make usage of the error in userland and readable-stream easier.
// It is a regular error with `.code` and `.name`.
export class AbortError extends Error {
  constructor(message = 'The operation was aborted') {
    super(message);
    this.code = 'ABORT_ERR';
    this.name = 'AbortError';
  }
}

// Only use this for integers! Decimal numbers do not work with this function.
const addNumericalSeparator = (val) => {
  let res = '';
  let i = val.length;
  let start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`;
  }
  return `${val.slice(0, i)}${res}`;
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
