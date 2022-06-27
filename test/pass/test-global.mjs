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

test('has setTimeout', () => {
  assert(typeof global.setTimeout === 'function')
})

test('has setInterval()', () => {
  assert(typeof global.setInterval === 'function')
})

test('has setImmediate()', () => {
  assert(typeof global.setImmediate === 'function')
})

test('has clearTimeout()', () => {
  assert(typeof global.clearTimeout === 'function')
})

test('has clearInterval()', () => {
  assert(typeof global.clearInterval === 'function')
})

test('has queueMicrotask()', () => {
  assert(typeof global.queueMicrotask === 'function')
})

test('has class Event', () => {
  assert(typeof global.Event === 'function')
})

test('has class EventTarget', () => {
  assert(typeof global.EventTarget === 'function')
})

test('has class URL', () => {
  assert(typeof global.URL === 'function')
})

test('has class URLSearchParams', () => {
  assert(typeof global.URLSearchParams === 'function')
})

test('has class Buffer', () => {
  assert(typeof global.Buffer === 'function')
})

test('has console', () => {
  assert(global.console)
})

test('has process', () => {
  assert(global.process)
})
