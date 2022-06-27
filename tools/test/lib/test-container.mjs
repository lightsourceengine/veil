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

import { basename } from 'node:path'

const testCases = []

const registerTest = (...args) => {
  testCases.push({
    description: args[0],
    options: typeof args[1] === 'function' ? {} : args[1],
    fn: typeof args[1] === 'function' ? args[1] : args[2]
  })
}

const isPromise = (p) => p && Object.prototype.toString.call(p) === "[object Promise]"

const main = async () => {
  const test = process.argv[2];
  const testName = basename(test)
  let failures = 0

  global.test = registerTest

  try {
    await import(test)
  } catch (e) {
    // TODO: import is throwing a spurious error, but the code is evaluating.. needs investigation
  }

  console.log(testName)

  for (const t of testCases) {
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

main()
  .catch(e => {
    console.error('Test Runner Container Fatal Error')
    console.error(e)
  })