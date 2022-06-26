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

import { assert } from 'node:assert'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

let require

// should load json file from absolute path
require = createRequire(fileURLToPath(import.meta.url))
assert(require('./assets/test.json').key === "test")

// should load json file from url
require = createRequire(import.meta.url)
assert(require('./assets/test.json').key === "test")
