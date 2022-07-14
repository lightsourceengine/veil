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
import { readFile, stat } from 'node:fs/promises'
import { dirname } from 'node:path'

const testFile = './assets/test.json'

// readFile()

test('readFile() file not found', async () => {
  await rejects(readFile('does not exist'))
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

// stat()

test('stat() stat file', async () => {
  checkStatsForFile(await stat(testFile))
})

test('stat() stat directory', async () => {
  checkStatsForDirectory(await stat(dirname(testFile)))
})

test('stat() stat file (bigint Stats)', async () => {
  checkStatsForFile(await stat(testFile, { bigint: true }), 'bigint')
})

test('stat() stat directory (bigint Stats)', async () => {
  checkStatsForDirectory(await stat(dirname(testFile), { bigint: true }), 'bigint')
})

test('stat() file not found', async () => {
  await rejects(stat('does not exist'))
})

// test utils

// TODO: in test-fs as well.. move to a lib

const rejects = async (promise) => {
  try {
    await promise
  } catch {
    return
  }

  assert.fail('exception expected')
}

const checkStatsForFile = (stats, expectedType = 'number') => {
  assert(stats)
  assert.equal(typeof stats.mode, expectedType)
  assert.equal(stats.isFile(), true)
  assert.equal(stats.isDirectory(), false)
  assert.equal(stats.isBlockDevice(), false)
  assert.equal(stats.isFIFO(), false)
  assert.equal(stats.isCharacterDevice(), false)
  assert.equal(stats.isSocket(), false)
  assert.equal(stats.isSymbolicLink(), false)
}

const checkStatsForDirectory = (stats, expectedType = 'number') => {
  assert(stats)
  assert.equal(typeof stats.mode, expectedType)
  assert.equal(stats.isFile(), false)
  assert.equal(stats.isDirectory(), true)
  assert.equal(stats.isBlockDevice(), false)
  assert.equal(stats.isFIFO(), false)
  assert.equal(stats.isCharacterDevice(), false)
  assert.equal(stats.isSocket(), false)
  assert.equal(stats.isSymbolicLink(), false)
}
