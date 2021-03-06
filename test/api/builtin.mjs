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

// JSON dump of the veil builtin packages.
//
// Serves as a sanity check that builtins can be imported. And, this script can be run on node for
// comparison purposes.

import assert from 'node:assert'
import constants from 'node:constants'
import crypto from 'node:crypto'
import dgram from 'node:dgram'
import dns from 'node:dns'
import events, {
  EventEmitter
} from 'node:events'
import fs, {
  createWriteStream,
  createReadStream,
  readdirSync,
  readdir,
  renameSync,
  rename,
  unlinkSync,
  unlink,
  rmdirSync,
  rmdir,
  mkdirSync,
  mkdir,
  writeFileSync,
  writeFile,
  readFileSync,
  readFile,
  writeSync,
  write,
  readSync,
  read,
  openSync,
  open,
  closeSync,
  close,
  fstatSync,
  fstat,
  statSync,
  stat,
  existsSync,
  exists,
  promises
} from 'node:fs'
import {
  readdir as fsp_readdir,
  rename as fsp_rename,
  unlink as fsp_unlink,
  rmdir as fsp_rmdir,
  mkdir as fsp_mkdir,
  writeFile as fsp_writeFile,
  readFile as fsp_readFile,
  write as fsp_write,
  read as fsp_read,
  open as fsp_open,
  close as fsp_close,
  fstat as fsp_fstat,
  stat as fsp_stat,
  exists as fsp_exists,
} from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import eventTarget from 'node:internal/event_target'
import module, {
  createRequire,
  builtinModules
} from 'node:module'
import net from 'node:net'
import os, {
  EOL,
  arch,
  homedir,
  hostname,
  platform,
  tmpdir
} from 'node:os'
import path, {
  basename,
  delimiter,
  dirname,
  extname,
  format,
  isAbsolute,
  join,
  normalize,
  parse,
  relative,
  resolve,
  sep,
  toNamespacedPath,
  posix,
  win32,
} from 'node:path'
import perf_hooks, {
  performance
} from 'node:perf_hooks'
import stream from 'node:stream'
import tcp from 'node:tcp'
import timers, {
  setTimeout,
  setInterval,
  setImmediate,
  clearTimeout,
  clearInterval
} from 'node:timers'
import tls from 'node:tls'
import udp from 'node:udp'
import url, {
  URL,
  URLSearchParams,
  urlToHttpOptions,
  fileURLToPath,
  pathToFileURL
} from 'node:url'
import util from 'node:util'

// XXX: rename exports because vm will throw exception that the names shadow global variable names (bug in vm)
import _buffer, {
  Buffer
} from 'node:buffer'
import _console, {
  console
} from 'node:console'
import _process, {
  process
} from 'node:process'

const survey = {
  builtin: {
    assert: Object.keys(assert),
    buffer: typeof _buffer,
    console: console === global.console,
    constants: Object.keys(constants),
    crypto: Object.keys(crypto),
    dgram: Object.keys(dgram),
    dns: Object.keys(dns),
    events: typeof events,
    even_target: Object.keys(eventTarget),
    fs: Object.keys(fs),
    http: Object.keys(http),
    https: Object.keys(https),
    module: Object.keys(module),
    net: Object.keys(net),
    os: Object.keys(os),
    path: Object.keys(path),
    perf_hooks: {
      performance: Object.keys(performance)
    },
    process: process === global.process,
    tcp: Object.keys(tcp),
    timers: Object.keys(timers),
    tls: Object.keys(tls),
    udp: Object.keys(udp),
    url: Object.keys(url),
    util: Object.keys(util)
  }
}

console.log(JSON.stringify(survey, null, 2))
