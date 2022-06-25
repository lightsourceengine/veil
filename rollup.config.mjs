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

import { terser } from 'rollup-plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'
import replace from '@rollup/plugin-replace'
import { babel } from '@rollup/plugin-babel'
import { readdirSync } from 'fs'
import module from 'node:module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const sourceRoot = dirname(fileURLToPath(import.meta.url))
const minifiedOutputPath = join(sourceRoot, 'generated', 'js-min')

const minify = (options = {}) => terser({
  mangle: {
    module: true,
    reserved: options.reserved,
    // disable common source of minification bugs
    properties: false
  },
  compress: {
    defaults: false,
    join_vars: true,
    arrows: true,
    sequences: true,
    module: true
  },
  output: {
    // source contains escaped unicode chars, preserve them. js2c.py does not handle unicode.
    ascii_only: true,
    quote_style: 1,
    semicolons: false
  },
  // jerryscript is mostly ES2020, but there are a few things missing
  ecma: 2020,
  module: true
})

const onwarn = (warning, warn) => {
  warn(warning)
  throw Error(warning.message)
}

const veilBuiltins = [
  'udp',
  'http_client',
  'http_incoming',
  'http_parser',
  'http_server',
  'http_outgoing',
  'http_common',
  'stream_duplex',
  'stream_internal',
  'stream_readable',
  'stream_writable',
  'tcp'
]

const min = (input, outputFile) => {
  return {
    input,
    onwarn,
    output: {
      file: outputFile,
      format: 'esm',
      preferConst: true
    },
    plugins: [
      externals({
        include: veilBuiltins
      }),
      nodeResolve(),
      // support ?. for builtin development (jerryscript does not support these yet)
      babel({
        // if this is not set, babel complains. if babel has to use helpers for this code, something is wrong.
        babelHelpers: 'inline'
      }),
      minify()
    ]
  }
}

// pull in cjs-module-lexer
const lexer = () => {
  return {
    // works on version 1.2.2 - returns non-minified cjs with no dependencies
    input: module.createRequire(import.meta.url).resolve('cjs-module-lexer'),
    onwarn,
    output: {
      file: `${minifiedOutputPath}/lexer.mjs`,
      format: 'esm',
      preferConst: true
    },
    plugins: [
      // works on version 1.2.2 - slightly easier than using commonjs()
      replace({
        'module.exports.init': 'export const init',
        'module.exports.parse': 'export const parse',
        preventAssignment: false
      }),
      minify()
    ]
  }
}

const ops = readdirSync('src/js')
  .filter(file => file.endsWith('.mjs'))
  .map(file => min(`src/js/${file}`, join(minifiedOutputPath, file)))

ops.push(min(`src/js/fs/promises.mjs`, join(minifiedOutputPath, 'fs/promises.mjs')))
ops.push(min(`src/js/internal/event_target.mjs`, join(minifiedOutputPath, 'internal/event_target.mjs')))

ops.push(lexer())

export default ops
