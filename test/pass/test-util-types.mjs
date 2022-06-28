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

import {
  isPromise,
  isTypedArray,
  isUint8Array,
  isUint8ClampedArray,
  isUint16Array,
  isUint32Array,
  isInt8Array,
  isInt16Array,
  isInt32Array,
  isFloat32Array,
  isFloat64Array,
  isBigInt64Array,
  isBigUint64Array
} from 'node:util/types'
import assert from 'node:assert'

test('isPromise() returns true for Promise instance', () => {
  assert.equal(isPromise(Promise.resolve()), true)
})

test('isPromise() returns false', () => {
  testInputs(isPromise, junkInput, false)
})

test('isTypedArray() returns true for all type array instances', () => {
  testInputs(isTypedArray, knownTypedArrays.map(T => new T(1)), true)
})

test('isTypedArray() returns false', () => {
  testInputs(isTypedArray, junkInput, false)
})

test('isUint8ClampedArray() returns true for typed array instance', () => {
  assert.equal(isUint8ClampedArray(new Uint8ClampedArray(1)), true)
})

test('isUint8ClampedArray() returns false', () => {
  testInputs(isUint8ClampedArray, junkInput, false)
})

test('isUint8Array() returns true for typed array instance', () => {
  assert.equal(isUint8Array(new Uint8Array(1)), true)
})

test('isUint8Array() returns false', () => {
  testInputs(isUint8Array, junkInput, false)
})

test('isUint16Array() returns true for typed array instance', () => {
  assert.equal(isUint16Array(new Uint16Array(1)), true)
})

test('isUint16Array() returns false', () => {
  testInputs(isUint16Array, junkInput, false)
})

test('isUint32Array() returns true for typed array instance', () => {
  assert.equal(isUint32Array(new Uint32Array(1)), true)
})

test('isUint32Array() returns false', () => {
  testInputs(isUint32Array, junkInput, false)
})

test('isInt8Array() returns true for typed array instance', () => {
  assert.equal(isInt8Array(new Int8Array(1)), true)
})

test('isInt8Array() returns false', () => {
  testInputs(isInt8Array, junkInput, false)
})

test('isInt16Array() returns true for typed array instance', () => {
  assert.equal(isInt16Array(new Int16Array(1)), true)
})

test('isInt16Array() returns false', () => {
  testInputs(isInt16Array, junkInput, false)
})

test('isInt32Array() returns true for typed array instance', () => {
  assert.equal(isInt32Array(new Int32Array(1)), true)
})

test('isInt32Array() returns false', () => {
  testInputs(isInt32Array, junkInput, false)
})

test('isFloat32Array() returns true for typed array instance', () => {
  assert.equal(isFloat32Array(new Float32Array(1)), true)
})

test('isFloat32Array() returns false', () => {
  testInputs(isFloat32Array, junkInput, false)
})

test('isFloat64Array() returns true for typed array instance', () => {
  assert.equal(isFloat64Array(new Float64Array(1)), true)
})

test('isFloat64Array() returns false', () => {
  testInputs(isFloat64Array, junkInput, false)
})

test('isBigInt64Array() returns true for typed array instance', () => {
  assert.equal(isBigInt64Array(new BigInt64Array(1)), true)
})

test('isBigInt64Array() returns false', () => {
  testInputs(isBigInt64Array, junkInput, false)
})

test('isBigUint64Array() returns true for typed array instance', () => {
  assert.equal(isBigUint64Array(new BigUint64Array(1)), true)
})

test('isBigUint64Array() returns false', () => {
  testInputs(isBigUint64Array, junkInput, false)
})

const testInputs = (testee, inputs, expected) => {
  for (const input of inputs) {
    assert.equal(testee(input), expected)
  }
}

const junkInput = [ null, undefined, {}, [], new Map(), Infinity, '', 2, true, false ]

const knownTypedArrays = [
  Uint8Array,
  Uint8ClampedArray,
  Uint16Array,
  Uint32Array,
  Int8Array,
  Int16Array,
  Int32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array
]
