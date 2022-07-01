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
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { builtinModules } from 'node:module'

const testDir = dirname(fileURLToPath(import.meta.url))

test('load all builtin modules by id', async () => {
  return Promise.all(builtinModules.map(id => import(id)))
})

test('load all builtin modules by node:id', async () => {
  return Promise.all(builtinModules.map(id => import(`node:${id}`)))
})

test('import from relative path (relative to parent)', async () => {
  return import('./assets/TestModule.mjs')
})

test('import from absolute path (filesystem path)', async () => {
  return import(join(testDir, 'assets', 'TestModule.mjs'))
})

test('import from absolute path (file URL)', async () => {
  return import(pathToFileURL(join(testDir, 'assets', 'TestModule.mjs')))
})

test('import from absolute path (file URL as string)', async () => {
  return import(pathToFileURL(join(testDir, 'assets', 'TestModule.mjs')).href)
})

// TODO: not implemented in veil, yet
test('import from a package', { skip: true }, async () => {
  return import('test-package')
})

// TODO: not implemented in veil, yet
test('import from a namespaced package', { skip: true }, async () => {
  return import('@namespace/test')
})

// TODO: not implemented in veil, yet
test('import from package with exports in package.json', { skip: true }, async () => {
  return import('test-package/child')
})
