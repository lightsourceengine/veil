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
  fsAsyncWrap,
  checkStatsForDirectory,
  checkStatsForFile,
  checkStatsForSymbolicLink,
  emptyTestLink,
  ensureTestLink,
  rejects,
  testLinkDestination
} from '@veil/testing'
import assert from 'node:assert'
import { dirname } from 'node:path'
import {
  closeSync,
  fstat,
  fstatSync,
  lstat,
  lstatSync,
  readlink,
  readlinkSync,
  readFile,
  readFileSync,
  openSync,
  stat,
  statSync,
  symlink,
  symlinkSync
} from 'node:fs'

const testFile = './assets/test.json'

// fstatSync()

test('fstatSync() stat file', () => {
  const fd = openSync(testFile);

  try {
    checkStatsForFile(fstatSync(fd))
  } finally {
    closeSync(fd);
  }
})

test('fstatSync() stat file (bigint Stats)', () => {
  const fd = openSync(testFile);

  try {
    checkStatsForFile(fstatSync(fd, { bigint: true }), 'bigint')
  } finally {
    closeSync(fd);
  }
})

// statSync()

test('statSync() stat file', () => {
  checkStatsForFile(statSync(testFile))
})

test('statSync() stat directory', () => {
  checkStatsForDirectory(statSync(dirname(testFile)))
})

test('statSync() stat file (bigint Stats)', () => {
  checkStatsForFile(statSync(testFile, { bigint: true }), 'bigint')
})

test('statSync() stat directory (bigint Stats)', () => {
  checkStatsForDirectory(statSync(dirname(testFile), { bigint: true }), 'bigint')
})

test('statSync() file not found', () => {
  assert.throws(() => statSync('does not exist'))
})

// lstatSync()

test('lstatSync() stat file', () => {
  checkStatsForFile(lstatSync(testFile))
})

test('lstatSync() stat link', () => {
  checkStatsForSymbolicLink(lstatSync(ensureTestLink()))
})

test('lstatSync() stat directory', () => {
  checkStatsForDirectory(lstatSync(dirname(testFile)))
})

test('lstatSync() stat file (bigint Stats)', () => {
  checkStatsForFile(lstatSync(testFile, { bigint: true }), 'bigint')
})

test('lstatSync() stat link (bigint Stats)', () => {
  checkStatsForSymbolicLink(lstatSync(ensureTestLink(), { bigint: true }), 'bigint')
})

test('lstatSync() stat directory (bigint Stats)', () => {
  checkStatsForDirectory(lstatSync(dirname(testFile), { bigint: true }), 'bigint')
})

test('lstatSync() file not found', () => {
  assert.throws(() => lstatSync('does not exist'))
})

// readFileSync()

test('readFileSync() file not found', () => {
  assert.throws(() => readFileSync('does not exist'))
})

test('readFileSync() with no options', () => {
  const buffer = readFileSync(testFile)

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFileSync() with { encoding: null }', () => {
  const buffer = readFileSync(testFile, { encoding: null })

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFileSync() with utf8', () => {
  JSON.parse(readFileSync(testFile, 'utf8'))
})

test('readFileSync() with { encoding: utf8 }', () => {
  JSON.parse(readFileSync(testFile, { encoding: 'utf8' }))
})

// symlinkSync
test('symlinkSync()', () => {
  const p = emptyTestLink()
  symlinkSync(testLinkDestination, p)

  assert(lstatSync(p).isSymbolicLink())
})

// readlinkSync()

test('readlinkSync()', () => {
  const p = ensureTestLink()
  const destination = readlinkSync(p)

  assert.equal(destination, testLinkDestination)
})

test('readlinkSync() from a normal file', () => {
  assert.throws(() => readlinkSync(testFile))
})

test('readlinkSync() file not found', () => {
  assert.throws(() => readlinkSync('does not exist'))
})

// readFile()

test('readFile() file not found', async () => {
  await rejects(fsAsyncWrap(readFile, 'does not exist'))
})

test('readFile() with no options', async () => {
  const buffer = await fsAsyncWrap(readFile, testFile)

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with { encoding: null }', async () => {
  const buffer = await fsAsyncWrap(readFile, testFile, { encoding: null })

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with utf8', async () => {
  JSON.parse(await fsAsyncWrap(readFile, testFile, 'utf8'))
})

test('readFile() with { encoding: utf8 }', async () => {
  JSON.parse(await fsAsyncWrap(readFile, testFile, { encoding: 'utf8' }))
})

// stat()

test('stat() stat file', async () => {
  checkStatsForFile(await fsAsyncWrap(stat, testFile))
})

test('stat() stat directory', async () => {
  checkStatsForDirectory(await fsAsyncWrap(stat, dirname(testFile)))
})

test('stat() stat file (bigint Stats)', async () => {
  checkStatsForFile(await fsAsyncWrap(stat, testFile, { bigint: true }), 'bigint')
})

test('stat() stat directory (bigint Stats)', async () => {
  checkStatsForDirectory(await fsAsyncWrap(stat, dirname(testFile), { bigint: true }), 'bigint')
})

test('stat() file not found', async () => {
  await rejects(fsAsyncWrap(stat, 'does not exist'))
})

// lstat()

test('lstat() stat file', async () => {
  checkStatsForFile(await fsAsyncWrap(lstat, testFile))
})

test('lstat() stat link', async () => {
  checkStatsForSymbolicLink(await fsAsyncWrap(lstat, ensureTestLink()))
})

test('lstat() stat directory', async () => {
  checkStatsForDirectory(await fsAsyncWrap(lstat, dirname(testFile)))
})

test('lstat() stat file (bigint Stats)', async () => {
  checkStatsForFile(await fsAsyncWrap(lstat, testFile, { bigint: true }), 'bigint')
})

test('lstat() stat link (bigint Stats)', async () => {
  checkStatsForSymbolicLink(await fsAsyncWrap(lstat, ensureTestLink(), { bigint: true }), 'bigint')
})

test('lstat() stat directory (bigint Stats)', async () => {
  checkStatsForDirectory(await fsAsyncWrap(lstat, dirname(testFile), { bigint: true }), 'bigint')
})

test('lstat() file not found', async () => {
  await rejects(fsAsyncWrap(lstat, 'does not exist'))
})

// fstat()

test('fstat() stat file', async () => {
  const fd = openSync(testFile);

  try {
    checkStatsForFile(await fsAsyncWrap(fstat, fd))
  } finally {
    closeSync(fd);
  }
})

test('fstat() stat file (bigint Stats)', async () => {
  const fd = openSync(testFile);

  try {
    checkStatsForFile(await fsAsyncWrap(fstat, fd, { bigint: true }), 'bigint')
  } finally {
    closeSync(fd);
  }
})

// readlink()

test('readlink()', async () => {
  const p = ensureTestLink()
  const destination = await fsAsyncWrap(readlink, p)

  assert.equal(destination, testLinkDestination)
})

test('readlink() from a normal file', async () => {
  await rejects(fsAsyncWrap(readlink, testFile))
})

test('readlink() file not found', async () => {
  await rejects(fsAsyncWrap(readlink, 'does not exist'))
})

// symlink()

test('symlink()', async () => {
  const p = emptyTestLink()

  await fsAsyncWrap(symlink, testLinkDestination, p)

  assert(lstatSync(p).isSymbolicLink())
})
