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

class TestPrivateClassFields {
  static #staticPrivateProperty = 'private static property'

  static #privateStaticMethod() {
    return 'private static method'
  }

  static getPrivateStaticProperty() {
    return TestPrivateClassFields.#staticPrivateProperty
  }

  static callPrivateStaticMethod() {
    return this.#privateStaticMethod()
  }

  // XXX: the test will fail without the semicolon. jerry parser error
  #privateProperty = 'private property';

  #privateMethod() {
    return 'private method'
  }

  getPrivateProperty() {
    return this.#privateProperty
  }

  callPrivateMethod() {
    return this.#privateMethod()
  }
}

const instance = new TestPrivateClassFields()

test('private static property', () => {
  assert.equal(TestPrivateClassFields.getPrivateStaticProperty(), 'private static property')
})

test('call private static method', () => {
  assert.equal(TestPrivateClassFields.callPrivateStaticMethod(), 'private static method')
})

test('private property', () => {
  assert.equal(instance.getPrivateProperty(), 'private property')
})

test('call private method', () => {
  assert.equal(instance.callPrivateMethod(), 'private method')
})
