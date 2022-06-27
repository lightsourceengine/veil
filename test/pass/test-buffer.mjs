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
import BufferClass from 'node:buffer'

// check all static methods exposed by veil

test('has static from()', () => {
  assert(typeof BufferClass.from === 'function')
})

test('has static isBuffer()', () => {
  assert(typeof BufferClass.isBuffer === 'function')
})

test('has static byteLength()', () => {
  assert(typeof BufferClass.byteLength === 'function')
})

test('has static concat()', () => {
  assert(typeof BufferClass.concat === 'function')
})
