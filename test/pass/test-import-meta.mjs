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
import { fileURLToPath, URL } from 'node:url'
import { basename } from 'node:path'

test('import.meta.url is an instance of URL', () => {
  return assert(import.meta.url instanceof URL)
})

test('import.meta.url matches this test filename', () => {
  return assert.equal(basename(fileURLToPath(import.meta.url)), 'test-import-meta.mjs')
})
