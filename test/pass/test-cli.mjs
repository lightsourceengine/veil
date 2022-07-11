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
import { spawn } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const spawnOpts = { stdio: 'ignore', cwd: dirname(fileURLToPath(import.meta.url)) }

const veil = async (args) => {
  const child = spawn(process.execPath, args, spawnOpts)

  return new Promise((resolve, reject) => {
    child.on('exit', (exitCode) => {
      resolve(exitCode)
    })
    child.on('error', (err) => {
      reject(err)
    })
  })
}

test('--help, -h returns 0', async () => {
  assert.equal(await veil([ '--help' ]), 0)
  assert.equal(await veil([ '-h' ]), 0)
})

test('--version, -v returns 0', async () => {
  assert.equal(await veil([ '--version' ]), 0)
  assert.equal(await veil([ '-v' ]), 0)
})

test('invalid argument returns non-zero', async () => {
  assert.notEqual(await veil([ '--invalid', './assets/TestModule.mjs' ]), 0)
})

test('--no-addon is accepted', async () => {
  assert.equal(await veil([ '--no-addon', './assets/TestModule.mjs' ]), 0)
})

test('--expose-gc is accepted', async () => {
  assert.equal(await veil([ '--expose-gc', './assets/TestModule.mjs' ]), 0)
})

test('--loader with valid loader script is accepted', async () => {
  assert.equal(await veil([ '--loader', './assets/TestLoader.mjs', './assets/TestModule.mjs' ]), 0)
})

test('--loader with invalid loader script returns non-zero', async () => {
  assert.notEqual(await veil([ '--loader', 'does not exist!', './assets/TestModule.mjs' ]), 0)
})

test('--conditions x is accepted', async () => {
  assert.equal(await veil([ '--conditions', 'x', './assets/TestModule.mjs' ]), 0)
})

test('--conditions=x is accepted', async () => {
  assert.equal(await veil([ '--conditions=x', './assets/TestModule.mjs' ]), 0)
})

test('-C x is accepted', async () => {
  assert.equal(await veil([ '-C', 'x', './assets/TestModule.mjs' ]), 0)
})

test('multiple conditions accepted', async () => {
  assert.equal(await veil([ '-C', 'x', '--conditions=y', '--conditions', 'z', './assets/TestModule.mjs' ]), 0)
})

test('--es-module-specifier-resolution=explicit', async () => {
  assert.equal(await veil([ '--es-module-specifier-resolution=explicit', './assets/TestModule.mjs' ]), 0)
})

test('--es-module-specifier-resolution explicit', async () => {
  assert.equal(await veil([ '--es-module-specifier-resolution', 'explicit', './assets/TestModule.mjs' ]), 0)
})

test('--es-module-specifier-resolution=node', async () => {
  assert.equal(await veil([ '--es-module-specifier-resolution=node', './assets/TestModule' ]), 0)
})

test('--es-module-specifier-resolution node', async () => {
  assert.equal(await veil([ '--es-module-specifier-resolution', 'node', './assets/TestModule' ]), 0)
})

test('--es-module-specifier-resolution return non-zero for unsupported algorithm', async () => {
  assert.notEqual(await veil([ '--es-module-specifier-resolution', 'unsupported', './assets/TestModule' ]), 0)
})
