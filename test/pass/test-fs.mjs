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
import { readFile, readFileSync } from 'node:fs'

const testFile = './assets/test.json'

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

test('readFile() file not found', async () => {
  const p = new Promise((resolve, reject) => {
    readFile('does not exits', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

  try {
    await p
  } catch {
    return
  }

  assert.fail('expected exception')
})

test('readFile() with no options', async () => {
  const p = new Promise((resolve, reject) => {
    readFile(testFile, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

  const buffer = await p

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with { encoding: null }', async () => {
  const p = new Promise((resolve, reject) => {
    readFile(testFile, { encoding: null }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

  const buffer = await p

  assert(Buffer.isBuffer(buffer))
  JSON.parse(buffer.toString('utf8'))
})

test('readFile() with utf8', async () => {
  const p = new Promise((resolve, reject) => {
    readFile(testFile, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

  JSON.parse(await p)
})

test('readFile() with { encoding: utf8 }', async () => {
  const p = new Promise((resolve, reject) => {
    readFile(testFile, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })

  JSON.parse(await p)
})
