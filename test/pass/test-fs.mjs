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
import { dirname } from 'node:path'
import { closeSync, fstat, fstatSync, readFile, readFileSync, openSync, stat, statSync } from 'node:fs'

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

// readFile()

test('readFile() file not found', async () => {
  await rejects(asyncWrap(readFile, 'does not exist'))
})

test('readFile() with no options', async () => {
  const buffer = await asyncWrap(readFile, testFile)

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with { encoding: null }', async () => {
  const buffer = await asyncWrap(readFile, testFile, { encoding: null })

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with utf8', async () => {
  JSON.parse(await asyncWrap(readFile, testFile, 'utf8'))
})

test('readFile() with { encoding: utf8 }', async () => {
  JSON.parse(await asyncWrap(readFile, testFile, { encoding: 'utf8' }))
})

// stat()

test('stat() stat file', async () => {
  checkStatsForFile(await asyncWrap(stat, testFile))
})

test('stat() stat directory', async () => {
  checkStatsForDirectory(await asyncWrap(stat, dirname(testFile)))
})

test('stat() stat file (bigint Stats)', async () => {
  checkStatsForFile(await asyncWrap(stat, testFile, { bigint: true }), 'bigint')
})

test('stat() stat directory (bigint Stats)', async () => {
  checkStatsForDirectory(await asyncWrap(stat, dirname(testFile), { bigint: true }), 'bigint')
})

test('stat() file not found', async () => {
  await rejects(asyncWrap(stat, 'does not exist'))
})

// fstat()

test('fstat() stat file', async () => {
  const fd = openSync(testFile);

  try {
    checkStatsForFile(await asyncWrap(fstat, fd))
  } finally {
    closeSync(fd);
  }
})

test('fstat() stat file (bigint Stats)', async () => {
  const fd = openSync(testFile);

  try {
    checkStatsForFile(await asyncWrap(fstat, fd, { bigint: true }), 'bigint')
  } finally {
    closeSync(fd);
  }
})

// test utils

const asyncWrap = async (func, ...args) => {
  return await new Promise((resolve, reject) => {
    func(...args, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

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
}
