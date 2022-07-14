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
  checkStatsForDirectory,
  checkStatsForFile,
  emptyTestLink, ensureTestLink,
  rejects,
  testLinkDestination
} from '@veil/testing'
import assert from 'node:assert'
import { lstat, readlink, readFile, stat, symlink } from 'node:fs/promises'
import { dirname } from 'node:path'
import { lstatSync } from 'node:fs'

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

// lstat()

test('lstat() stat file', async () => {
  checkStatsForFile(await lstat(testFile))
})

test('lstat() stat directory', async () => {
  checkStatsForDirectory(await lstat(dirname(testFile)))
})

test('lstat() stat file (bigint Stats)', async () => {
  checkStatsForFile(await lstat(testFile, { bigint: true }), 'bigint')
})

test('lstat() stat directory (bigint Stats)', async () => {
  checkStatsForDirectory(await lstat(dirname(testFile), { bigint: true }), 'bigint')
})

test('lstat() file not found', async () => {
  await rejects(lstat('does not exist'))
})

// symlink()

test('symlink()', async () => {
  const p = emptyTestLink()

  await symlink(testLinkDestination, p)

  assert(lstatSync(p).isSymbolicLink())
})

// readlink()

test('readlink()', async () => {
  const p = ensureTestLink()
  const destination = await readlink(p)

  assert.equal(destination, testLinkDestination)
})

test('readlink() from a normal file', async () => {
  await rejects(readlink(testFile))
})

test('readlink() file not found', async () => {
  await rejects(readlink('does not exist'))
})