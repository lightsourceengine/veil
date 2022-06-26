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

import { fileURLToPath, URL } from 'url'
import { ChildProcess, convertToValidSignal } from './internal/child_process.mjs'
import {
  AbortError,
  ERR_INVALID_ARG_VALUE,
  ERR_INVALID_ARG_TYPE,
  ERR_OUT_OF_RANGE
} from './internal/errors.mjs'
import {
  validateBoolean,
  validateObject,
  validateString,
  validateAbortSignal
} from './internal/validators.mjs'

const kEmptyObject = Object.freeze({})
const kCmdExeRegEx = /^(?:.*\\)?cmd(?:\.exe)?$/i

const isInt32 = (value) => value === (value | 0)

const normalizeSpawnArguments = (file, args, options) => {
  validateString(file, 'file');

  if (file.length === 0)
    throw new ERR_INVALID_ARG_VALUE('file', file, 'cannot be empty');

  if (Array.isArray(args)) {
    args = args.slice();
  } else if (args == null) {
    args = [];
  } else if (typeof args !== 'object') {
    throw new ERR_INVALID_ARG_TYPE('args', 'object', args);
  } else {
    options = args;
    args = [];
  }

  if (options === undefined)
    options = kEmptyObject;
  else
    validateObject(options, 'options');

  let cwd = options.cwd;

  // Validate the cwd, if present.
  if (cwd != null) {
    cwd = getValidatedPath(cwd, 'options.cwd');
  }

  // Validate detached, if present.
  if (options.detached != null) {
    validateBoolean(options.detached, 'options.detached');
  }

  // Validate the uid, if present.
  if (options.uid != null && !isInt32(options.uid)) {
    throw new ERR_INVALID_ARG_TYPE('options.uid', 'int32', options.uid);
  }

  // Validate the gid, if present.
  if (options.gid != null && !isInt32(options.gid)) {
    throw new ERR_INVALID_ARG_TYPE('options.gid', 'int32', options.gid);
  }

  // Validate the shell, if present.
  if (options.shell != null && typeof options.shell !== 'boolean' && typeof options.shell !== 'string') {
    throw new ERR_INVALID_ARG_TYPE('options.shell', ['boolean', 'string'], options.shell);
  }

  // Validate argv0, if present.
  if (options.argv0 != null) {
    validateString(options.argv0, 'options.argv0');
  }

  // Validate windowsHide, if present.
  if (options.windowsHide != null) {
    validateBoolean(options.windowsHide, 'options.windowsHide');
  }

  // Validate windowsVerbatimArguments, if present.
  let { windowsVerbatimArguments } = options;
  if (windowsVerbatimArguments != null) {
    validateBoolean(windowsVerbatimArguments,
      'options.windowsVerbatimArguments');
  }

  if (options.shell) {
    const command = [file, ...args].join(' ');
    // Set the shell, switches, and commands.
    if (process.platform === 'win32') {
      if (typeof options.shell === 'string')
        file = options.shell;
      else
        file = process.env.comspec || 'cmd.exe';
      // '/d /s /c' is used only for cmd.exe.
      if (kCmdExeRegEx.test(file)) {
        args = ['/d', '/s', '/c', `"${command}"`];
        windowsVerbatimArguments = true;
      } else {
        args = ['-c', command];
      }
    } else {
      if (typeof options.shell === 'string')
        file = options.shell;
      else if (process.platform === 'android')
        file = '/system/bin/sh';
      else
        file = '/bin/sh';
      args = ['-c', command];
    }
  }

  if (typeof options.argv0 === 'string') {
    args.unshift(options.argv0);
  } else {
    args.unshift(file);
  }

  const env = options.env || process.env;
  const envPairs = [];

  // process.env.NODE_V8_COVERAGE always propagates, making it possible to
  // collect coverage for programs that spawn with white-listed environment.
  if (process.env.NODE_V8_COVERAGE && !(options.env || {}).hasOwnProperty('NODE_V8_COVERAGE')) {
    env.NODE_V8_COVERAGE = process.env.NODE_V8_COVERAGE;
  }

  let envKeys = [];
  // Prototype values are intentionally included.
  for (const key in env) {
    envKeys.push(key);
  }

  if (process.platform === 'win32') {
    // On Windows env keys are case insensitive. Filter out duplicates,
    // keeping only the first one (in lexicographic order)
    const sawKey = new Set();
    envKeys = envKeys.sort().filter(
      (key) => {
        const uppercaseKey = key.toUpperCase();
        if (sawKey.has(uppercaseKey)) {
          return false;
        }
        sawKey.add(uppercaseKey);
        return true;
      }
    );
  }

  for (const key of envKeys) {
    const value = env[key];
    if (value !== undefined) {
      envPairs.push(`${key}=${value}`);
    }
  }

  return {
    // Make a shallow copy so we don't clobber the user's options object.
    ...options,
    args,
    cwd,
    detached: !!options.detached,
    envPairs,
    file,
    windowsHide: !!options.windowsHide,
    windowsVerbatimArguments: !!windowsVerbatimArguments,
  };
}

const getValidatedPath = (fileURLOrPath, propName = 'path') => {
  const path = fileURLOrPath instanceof URL ? fileURLToPath(fileURLOrPath) : fileURLOrPath

  if (typeof path !== 'string') {
    throw new ERR_INVALID_ARG_TYPE(propName, ['string', 'URL'], path);
  }

  return path
}

const abortChildProcess = (child, killSignal) => {
  if (!child)
    return;
  try {
    if (child.kill(killSignal)) {
      child.emit('error', new AbortError());
    }
  } catch (err) {
    child.emit('error', err);
  }
}

const validateTimeout = (timeout) => {
  if (timeout != null && !(Number.isInteger(timeout) && timeout >= 0)) {
    throw new ERR_OUT_OF_RANGE('timeout', 'an unsigned integer', timeout);
  }
}

const sanitizeKillSignal = (killSignal) => {
  if (typeof killSignal === 'string' || typeof killSignal === 'number') {
    return convertToValidSignal(killSignal);
  } else if (killSignal != null) {
    throw new ERR_INVALID_ARG_TYPE('options.killSignal', ['string', 'number'], killSignal);
  }
}

/**
 * Spawns a new process using the given `file`.
 * @param {string} file
 * @param {string[]} [args]
 * @param {{
 *   cwd?: string;
 *   env?: Record<string, string>;
 *   argv0?: string;
 *   stdio?: Array | string;
 *   detached?: boolean;
 *   uid?: number;
 *   gid?: number;
 *   serialization?: string;
 *   shell?: boolean | string;
 *   windowsVerbatimArguments?: boolean;
 *   windowsHide?: boolean;
 *   signal?: AbortSignal;
 *   timeout?: number;
 *   killSignal?: string | number;
 *   }} [options]
 * @returns {ChildProcess}
 */
const spawn = (file, args, options) => {
  options = normalizeSpawnArguments(file, args, options);
  validateTimeout(options.timeout);
  validateAbortSignal(options.signal, 'options.signal');
  const killSignal = sanitizeKillSignal(options.killSignal);
  const child = new ChildProcess();

  // TODO: debug('spawn', options);
  child.spawn(options);

  if (options.timeout > 0) {
    let timeoutId = setTimeout(() => {
      if (timeoutId) {
        try {
          child.kill(killSignal);
        } catch (err) {
          child.emit('error', err);
        }
        timeoutId = null;
      }
    }, options.timeout);

    child.once('exit', () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    });
  }

  if (options.signal) {
    const { signal } = options;
    const onAbortListener = () => abortChildProcess(child, killSignal)

    if (signal.aborted) {
      process.nextTick(onAbortListener);
    } else {
      signal.addEventListener('abort', onAbortListener, { once: true });
      child.once('exit',
        () => signal.removeEventListener('abort', onAbortListener));
    }
  }

  return child;
}

export { spawn, ChildProcess }

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
