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
// uv_getaddrinfo flags
const ADDRCONFIG = native.AI_ADDRCONFIG;
const V4MAPPED = native.AI_V4MAPPED;

const lookup = (hostname, options, callback) => {
  var hints = 0;
  var family = -1;

  // Parse arguments
  if (typeof hostname !== 'string') {
    throw TypeError('invalid argument: hostname must be a string');
  }
  if (typeof options === 'string') {
    callback = options;
    family = 0;
  } else if (typeof callback !== 'function') {
    throw TypeError('invalid argument: callback must be passed');
  } else if (options !== null && typeof options === 'object') {
    hints = options.hints >>> 0;
    family = options.family >>> 0;

    if (hints < 0 || hints > (ADDRCONFIG | V4MAPPED)) {
      throw new TypeError('invalid argument: invalid hints flags');
    }
  } else if (typeof options === 'number') {
    family = ~~options;
  } else {
    throw TypeError(
        'invalid argument: options must be either an object or number');
  }

  if (family !== 0 && family !== 4 && family !== 6)
    throw new TypeError('invalid argument: family must be 4 or 6');

  if (process.platform !== 'nuttx') {
    native.getaddrinfo(hostname, family, hints, callback);
  } else {
    // native.getaddrinfo is synchronous on these platforms.
    // needs to be wrapped into an asynchronous call.
    process.nextTick(() => { native.getaddrinfo(hostname, family, hints, callback) });
  }
};

export {
  lookup,
  ADDRCONFIG,
  V4MAPPED
}

export default {
  lookup,
  ADDRCONFIG,
  V4MAPPED
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
