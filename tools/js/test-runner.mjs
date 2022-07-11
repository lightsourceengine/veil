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
import { fileURLToPath, pathToFileURL } from 'node:url'
import { normalize, join, extname, basename, dirname, isAbsolute, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { isPromise } from 'node:util/types'
import { createRequire } from 'node:module'

/*
 * Test Runner
 *
 * Runs node:test style tests in veil.
 *
 * Note: The runner must run in veil and node. No npm imports. No non-builtin imports. No transpilation.
 */

const sourceRoot = normalize(join(fileURLToPath(import.meta.url), '..', '..', '..'))
const clientTestCases = []
const container = join(sourceRoot, 'tools', 'js', 'test-runner.mjs')
const config = {}

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

const clientTestFunction = (...args) => {
  clientTestCases.push({
    description: args[0],
    options: typeof args[1] === 'function' ? {} : args[1],
    fn: typeof args[1] === 'function' ? args[1] : args[2]
  })
}

const runOne = async (test) => {
  const testName = basename(test)
  let failures = 0

  global.test = clientTestFunction

  try {
    await import(pathToFileURL(test).href)
  } catch (e) {
    console.error(`Fatal Error: import('${test}')`)
    console.error(e)
    process.exit(1)
  }

  console.log(testName)

  for (const t of clientTestCases) {
    let result
    let caught
    let { skip } = t.options
    let status

    if (!skip) {
      try {
        result = t.fn()
      } catch (e) {
        caught = e
      }

      if (!caught && isPromise(result)) {
        try {
          await result
        } catch (e) {
          caught = e
        }
      }

      status = caught ? 'FAIL' : 'PASS'
    } else {
      status = 'SKIP'
    }

    console.log(`  [${status}] ${t.description}`)

    if (caught) {
      failures++
      console.log(caught)
    }

    if (failures > 0) {
      process.exit(1)
    }
  }
}

const runAll = async (dirs) => {
  let testSet = []
  let require = createRequire(import.meta.url)

  // find test-*.mjs files. non-recursive
  for (const dir of dirs) {
    let files = await readdir(dir)

    try {
      // XXX: use require, readFile is broken!
      const localConfig = require(join(dir, 'config.json'))

      for (const [ key, value ] of Object.entries(localConfig)) {
        config[join(dir, key)] = value
      }
    } catch {
      // ignore, config.json is optional
    }

    let testFiles = files
      .filter(file => file.startsWith('test-') && extname(file) === '.mjs')
      .map(file => join(dir, file))

    testSet.push(...testFiles)
  }

  // run each test file in a separate veil process
  let failed

  for (const test of testSet) {
    const testOptions = (config[test] || {}).opts ?? []
    const exitCode = await veil([ ...testOptions, container, '--run-one', test ], { stdio: 'inherit', cwd: dirname(test) })

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

const main = async () => {
  if (process.argv[2] === '--run-one') {
    const test = process.argv[3]

    if (!test) {
      throw Error('--run-one: No test specified')
    }

    await runOne(test)
  } else {
    await runAll([join(sourceRoot, 'test', 'pass')])
  }
}

main().catch((e) => {
  console.error('Test Runner Fatal Error')
  console.error(e)
})
