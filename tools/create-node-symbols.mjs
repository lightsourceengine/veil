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

import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'
import { EOL } from 'node:os'
import { createRequire } from 'node:module'

// Generates src/napi/node_symbols.txt
// run: node tools/create-node-symbols.mjs
// checkin: src/napi/node_symbols.txt

// node does not like dir imports, so use require
const self = import.meta.url
const require = createRequire(self)

// veil supports v3 of n-api
const { v3 } = require('../deps/node-api-headers').symbols

// veil is missing these apis from v3 (should be added)
const unimplemented = new Set([
  "napi_get_value_string_latin1",
  "napi_get_value_string_utf16",
  "napi_run_script"
])

// node_symbols.txt is just a list of symbols (one symbol per line). cmake will read this
// and set the compiler commands for undefined symbols
const file = resolve(fileURLToPath(self), '..', '..', 'src', 'napi', 'node_symbols.txt')

const isImplemented = (value) => !unimplemented.has(value)

// create the list from node-api-headers
const symbolsList = [ ...v3.js_native_api_symbols, ...v3.node_api_symbols ].filter(isImplemented)

// flush symbols to disk
writeFileSync(file, symbolsList.join(EOL), 'utf8')
