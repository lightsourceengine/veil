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
import { arch, EOL, homedir, hostname, platform, tmpdir } from 'node:os'

test('EOL is string', () => {
  assert(typeof EOL === 'string')
})

test('arch() returns string', () => {
  assert(typeof arch() === 'string')
})

test('arch() equals process.arch', () => {
  assert.equal(arch(), process.arch)
})

test('platform() returns string', () => {
  assert(typeof platform() === 'string')
})

test('platform() equals process.platform', () => {
  assert.equal(platform(), process.platform)
})

test('homedir() returns string', () => {
  assert(typeof homedir() === 'string')
})

test('hostname() returns string', () => {
  assert(typeof hostname() === 'string')
})

test('tmpdir() returns string', () => {
  assert(typeof tmpdir() === 'string')
})
