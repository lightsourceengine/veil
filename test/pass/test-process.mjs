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

import assert from 'node:assert'
import instance from 'node:process'

test('has argv', () => {
  assert(Array.isArray(instance.argv))
})

test('has argv0', () => {
  assert(typeof instance.argv0 === 'string')
})

test('has arch', () => {
  assert(typeof instance.arch === 'string')
})

test('has platform', () => {
  assert(typeof instance.platform === 'string')
})

test('has execPath', () => {
  assert(typeof instance.execPath === 'string')
})

test('has version', () => {
  assert(typeof instance.version === 'string')
})

test('has env', () => {
  assert(instance.env !== null && typeof instance.env === 'object')
})

test('has versions', () => {
  assert(instance.env !== null && typeof instance.env === 'object')
})

test('has pid', () => {
  assert(typeof instance.pid === 'number')
})

test('has exitCode', () => {
  assert(instance.exitCode !== undefined)
})

test('has nextTick()', () => {
  assert(typeof instance.nextTick === 'function')
})

test('has hrtime()', () => {
  assert(typeof instance.hrtime === 'function')
})

test('has exit()', () => {
  assert(typeof instance.exit === 'function')
})

test('has chdir()', () => {
  assert(typeof instance.chdir === 'function')
})

test('has cwd()', () => {
  assert(typeof instance.cwd === 'function')
})

test('cwd() return path', () => {
  assert(typeof instance.cwd() === 'string')
})
