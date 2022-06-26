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

import { assert } from 'assert'

// Dumps the global variables and their values to JSON. Can be run on node as well.

const functionExists = (name, value) => {
  return assert(
    typeof value === 'function',
    `Expected ${name} in global namespace to be a function got ${typeof value}`)
}

const classExists = (name, value) => {
  return assert(
    typeof value === 'function',
    `Expected ${name} in global namespace to be a class got ${typeof value}`)
}

const exists = (name, value) => {
  return assert(
    typeof value !== 'undefined',
    `Expected ${name} in global namespace to be present got undefined`)
}

const stringValue = (name, value) => {
  return assert(
    typeof value === 'string',
    `Expected ${name} in global namespace to be a string got ${typeof value}`)
}

const globalSpec = {
  setTimeout: functionExists,
  setInterval: functionExists,
  setImmediate: functionExists,
  clearTimeout: functionExists,
  clearInterval: functionExists,
  queueMicrotask: functionExists,
  Event: classExists,
  EventTarget: classExists,
  URL: classExists,
  URLSearchParams: classExists,
  console: {
    log: functionExists,
    info: functionExists,
    warn: functionExists,
    error: functionExists,
  },
  Buffer: {
    from: functionExists,
    isBuffer: functionExists,
    byteLength: functionExists,
    concat: functionExists
  },
  process: {
    argv: exists,
    arch: stringValue,
    argv0: exists,
    chdir: functionExists,
    cwd: functionExists,
    env: exists,
    execPath: exists,
    exit: functionExists,
    exitCode: exists,
    hrtime: functionExists,
    nextTick: functionExists,
    pid: exists,
    platform: stringValue,
    version: stringValue,
    versions: exists,
  }
}

const evaluate = (object, objectName, objectSpec) => {
  for (const [key, value] of Object.entries(objectSpec)) {
    if (typeof value === 'function') {
      objectSpec[key] = value(key, object[key])
    } else {
      evaluate(object[key], key, value)
    }
  }
}

evaluate(global, 'global', globalSpec)
