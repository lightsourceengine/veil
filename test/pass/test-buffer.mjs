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
import { Buffer } from 'node:buffer'

test('from() creates a new buffer from string', () => {
  const buffer = Buffer.from('a', 'utf8')

  assert(Buffer.isBuffer(buffer))
  assert.equal(buffer.length, 1)
})

test('isBuffer() returns true for buffer', () => {
  assert(Buffer.isBuffer(Buffer.from('a', 'utf8')))
})

test('isBuffer() returns false for non-Buffer input', () => {
  const inputs = [ '', 't', 3, null, undefined, Infinity, {}, [], () => {} ]

  inputs.forEach(input=> assert(!Buffer.isBuffer(input)))
})

test('byteLength() returns 1 for a single char UTF-8 string', () => {
  assert.equal(Buffer.byteLength('a', 'utf8'), 1)
})

test('byteLength() throws error for non-string input', { skip: true }, () => {
  assert.throws(() => Buffer.byteLength(5))
})

test('concat() merges two buffers', () => {
  const combined = Buffer.concat([Buffer.from('a', 'utf8'), Buffer.from('b', 'utf8')])

  assert.equal(combined.toString(), 'ab')
})

test('concat() throws error for no arguments', () => {
  assert.throws(() => Buffer.concat())
})
