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

import { spawn } from 'child_process'

const veil = async (args, options) => {
  const child = spawn(process.execPath, args, options)

  return new Promise((resolve, reject) => {
    child.on('exit', (exitCode) => {
      resolve(exitCode)
    })
    child.on('error', (err) => {
      reject(err)
    })
  })
}

test('spawn stdio = inherit', async () => {
  await veil(['--version'], { stdio: 'inherit' })
})

test('spawn stdio = [ inherit, inherit, inherit ]', async () => {
  await veil(['--version'], { stdio: [ 'inherit', 'inherit', 'inherit' ] })
})

test('spawn stdio = ignore', async () => {
  await veil(['--version'], { stdio: 'ignore' })
})

test('spawn stdio = [ ignore, ignore, ignore ]', async () => {
  await veil(['--version'], { stdio: [ 'ignore', 'ignore', 'ignore' ] })
})

test('spawn stdio = [ 0, 1, 2 ]', async () => {
  await veil(['--version'], { stdio: [ 0, 1, 2 ] })
})
