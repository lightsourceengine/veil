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

import { assert, fail } from 'node:assert'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { builtinModules } from 'node:module'

const testDir = dirname(fileURLToPath(import.meta.url))

// should import from relative path (relative to parent)
import('./assets/TestModule.mjs')
  .then((testModule) => {
    assert(testModule.default === 'TestModule')
  })
  .catch((e) => {
    fail('expected to dynamically load TestModule.mjs: ' + e.message)
  })


// should import from absolute path
import(join(testDir, 'assets', 'TestModule.mjs'))
  .then((testModule) => {
    assert(testModule.default === 'TestModule')
  })
  .catch((e) => {
    fail('expected to dynamically load TestModule.mjs: Error: ' + e.message)
  })


// TODO: not implemented in veil, yet
// should import from package
// import('test-package')
//   .then((exports) => {
//     assert(exports.default === 'test-package')
//   })
//   .catch(() => {
//     fail('expected to dynamically load test-package')
//   })


// TODO: not implemented in veil, yet
// should import from a namespaced package
// import('@namespace/test')
//   .then((exports) => {
//     assert(exports.default === 'test-package')
//   })
//   .catch(() => {
//     fail('expected to dynamically load test-package')
//   })


// TODO: not implemented in veil, yet
// should import from package with exports in package.json
// import('test-package/child')
//   .then((exports) => {
//     assert(exports.default === 'test-package')
//   })
//   .catch(() => {
//     fail('expected to dynamically load test-package')
//   })


// should load all builtin modules by id or with node: prefix
assert(builtinModules.length > 1)
const importList = builtinModules.reduce((list, id) => {
  list.push(import(id))
  list.push(import(`node:${id}`))
  return list
}, [])

Promise.all(importList)
  .then((builtins) => {
    assert(builtins.length === builtinModules.length * 2)
  })
  .catch((e) => {
    fail('failed to load a builtin module' + e.message)
  })