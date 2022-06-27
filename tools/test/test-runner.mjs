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

import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { normalize, join, extname } from 'node:path'
import { spawn } from 'node:child_process'

const sourceRoot = normalize(join(fileURLToPath(import.meta.url), '..', '..', '..'))
const container = join(sourceRoot, 'tools', 'test', 'lib', 'test-container.mjs')

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

const main = async () => {
  // find tests files
  const files = await readdir(join(sourceRoot, 'test', 'pass'))
  const tests = files
    .filter(file => file.startsWith('test-') && extname(file) === '.mjs')
    .map(file => join(sourceRoot, 'test', 'pass', file))
  let failed

  for (const test of tests) {
    const exitCode = await veil([ container, test ], { stdio: 'inherit' })

    if (exitCode !== 0) {
      failed = true
    }
  }

  if (failed) {
    console.error('TEST RUN FAILED')
    process.exit(1)
  } else {
    console.log('TEST RUN SUCCEEDED')
  }
}

main().catch((e) => {
  console.error('Test Runner Fatal Error')
  console.error(e)
})
