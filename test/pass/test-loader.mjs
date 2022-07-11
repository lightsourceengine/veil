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

// --loader TestLoader.mjs configured from ./config.json; source of pkg-from-loader

import assert from 'node:assert'
import loaderPackageDefault from 'pkg-from-loader'

const expectedDefault = 'TestLoader:pkg-from-loader'

test('import default should be a string', () => {
  assert.equal(loaderPackageDefault, expectedDefault)
})

test('dynamic import default should be a string', async () => {
  assert.equal((await import('pkg-from-loader')).default, expectedDefault)
})
