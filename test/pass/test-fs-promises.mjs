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
import { readFile } from 'node:fs/promises'

const testFile = './assets/test.json'

test('readFile() file not found', async () => {
  try {
    await readFile('does not exist')
  } catch {
    return
  }

  assert.fail('exception expected')
})

test('readFile() with no options', async () => {
  const buffer = await readFile(testFile)

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with { encoding: null }', async () => {
  const buffer = await readFile(testFile, { encoding: null })

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with utf8', async () => {
  JSON.parse(await readFile(testFile, 'utf8'))
})

test('readFile() with { encoding: utf8 }', async () => {
  JSON.parse(await readFile(testFile, { encoding: 'utf8' }))
})
