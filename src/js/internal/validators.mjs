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

import { ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE } from './errors.mjs'

export const validateObject = (value, name, options = undefined) => {
  if ((!options?.nullable && value === null) ||
    (!options?.allowArray && Array.isArray(value)) ||
    (typeof value !== 'object' && (
      !options?.allowFunction || typeof value !== 'function'
    ))) {
    throw new ERR_INVALID_ARG_TYPE(name, 'Object', value);
  }
}

export const validateString = (value, name) => {
  if (typeof value !== 'string') {
    throw new ERR_INVALID_ARG_TYPE(name, 'string', value)
  }
}

export const validateFunction = (value, name) => {
  if (typeof value !== 'function') {
    throw new ERR_INVALID_ARG_TYPE(name, 'Function', value);
  }
}

export const validateBoolean = (value, name) => {
  if (typeof value !== 'boolean')
    throw new ERR_INVALID_ARG_TYPE(name, 'boolean', value);
}

export const validateOneOf = (value, name, oneOf) => {
  if (!oneOf.includes(value)) {
    const allowed = oneOf.map((v) => (typeof v === 'string' ? `'${v}'` : String(v))).join(', ');
    throw new ERR_INVALID_ARG_VALUE(name, value, `'must be one of: ${allowed}`);
  }
}

export const validateArray = (value, name, minLength = 0) => {
  if (!Array.isArray(value)) {
    throw new ERR_INVALID_ARG_TYPE(name, 'Array', value);
  }
  if (value.length < minLength) {
    throw new ERR_INVALID_ARG_VALUE(name, value, `must be longer than ${minLength}`);
  }
}

export const validateAbortSignal = (signal, name) => {
  if (signal !== undefined && (signal === null || typeof signal !== 'object' || !('aborted' in signal))) {
    throw new ERR_INVALID_ARG_TYPE(name, 'AbortSignal', signal);
  }
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
