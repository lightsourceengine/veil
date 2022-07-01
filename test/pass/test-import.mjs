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

import relativeImport from './assets/TestModule.mjs'
import fromPkg from 'pkg'
import fromPkgSubpath from 'pkg/subpath'
import fromPkgWildcard from 'pkg/lib/star.mjs'
import fromPkgSugar from 'pkg-sugar'
import fromNsPkg from '@ns/pkg'
import fromNsPkgSubpath from '@ns/pkg/subpath'
import fromNsPkgWildcard from '@ns/pkg/lib/star.mjs'
import fromNsPkgSugar from '@ns/pkg-sugar'

test('import from relative path (./)', () => {
  assert.equal(relativeImport, 'TestModule')
})

test('import from a package', () => {
  assert.equal(fromPkg, 'pkg/index')
})

test('import subpath from a package', () => {
  assert.equal(fromPkgSubpath, 'pkg/subpath')
})

test('import wildcard subpath from a package', () => {
  assert.equal(fromPkgWildcard, 'pkg/star')
})

test('import from a package with exports syntactic sugar', () => {
  assert.equal(fromPkgSugar, 'pkg-sugar/index')
})

test('import from a scoped package', () => {
  assert.equal(fromNsPkg, '@ns/pkg/index')
})

test('import subpath from a scoped package', () => {
  assert.equal(fromNsPkgSubpath, '@ns/pkg/subpath')
})

test('import wildcard subpath from a scoped package', () => {
  assert.equal(fromNsPkgWildcard, '@ns/pkg/star')
})

test('import from a scoped package with exports syntactic sugar', () => {
  assert.equal(fromNsPkgSugar, '@ns/pkg-sugar/index')
})
