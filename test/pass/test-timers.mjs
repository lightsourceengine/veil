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

import { fail } from 'node:assert'
import { setTimeout, setInterval, setImmediate, clearTimeout, clearInterval, clearImmediate } from 'node:timers'

test('setTimeout() handler called', async () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 0)
  })
})

test('setInterval() handler called', async () => {
  return new Promise((resolve, reject) => {
    let count = 0
    let callback = () => {
      if (++count > 2) {
        clearInterval(handle)
        resolve()
      }
    }
    let handle = setInterval(callback, 10)
  })
})

test('setImmediate() handler called', async () => {
  return new Promise((resolve, reject) => {
    setImmediate(resolve)
  })
})

test('clearTimeout() before setTimeout() fires', () => {
  clearTimeout(setTimeout(() => fail('setTimeout() should not be running'), 0))
})

test('clearTimeout() idempotent', () => {
  const timeout = setTimeout(() => fail('setTimeout() should not be running'), 0)

  clearTimeout(timeout)
  clearTimeout(timeout)
})

test('clearTimeout() ignores bad input', () => {
  for (const input of junkInput) {
    clearTimeout(input)
  }
})

test('clearInterval() before first setInterval() fires', () => {
  clearInterval(setInterval(() => fail('setInterval() should not be running'), 1))
})

test('clearInterval() idempotent', () => {
  const timeout = setInterval(() => fail('setInterval() should not be running'), 1)

  clearInterval(timeout)
  clearInterval(timeout)
})

test('clearInterval() ignores bad input', () => {
  for (const input of junkInput) {
    clearInterval(input)
  }
})

test('clearImmediate() before setImmediate() fires', () => {
  clearImmediate(setImmediate(() => fail('setImmediate() should not be running')))
})

test('clearImmediate() idempotent', () => {
  const timeout = setImmediate(() => fail('setImmediate() should not be running'))

  clearImmediate(timeout)
  clearImmediate(timeout)
})

test('clearImmediate() ignores bad input', () => {
  for (const input of junkInput) {
    clearImmediate(input)
  }
})

const junkInput = [ null, undefined, {}, [], new Map(), Infinity, '', 2, true, false ]
