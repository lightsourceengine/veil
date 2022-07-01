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

let path /* import path from 'node:path' */
let url /* import url from 'node:url' */
let esm /* import esm from 'internal/esm' */

const { native } = import.meta

const {
  builtins,
  fromSymbols,
  fromBuiltin,
  fromFile,
  link,
  evaluate,
  evaluateWith,
  getNamespace,
  readFileSync,
  getState,
  STATE_EVALUATED
} = native

const builtinsSet = new Set(builtins)
// id -> Module, where id is the absolute path to the module js file or the builtin id
const cache = new Map()
// id -> Module, where id is the absolute path to the .node or .json file
const requireCache = new Map()

const isBuiltinSpecifier = (specifier) => builtinsSet.has(specifier.replace('node:', ''))

const linkResolve = (specifier, referrer) => {
  if (isBuiltinSpecifier(specifier)) {
    return builtinLinkResolve(specifier.replace('node:', ''))
  }

  const resolution = esm.esmResolveSync(specifier, { parentURL: referrer?.url.href })

  if (resolution.format !== 'module') {
    throw Error(`Unsupported import type [${resolution.format}] from '${specifier}'`)
  }

  return parseModule(url.fileURLToPath(resolution.url), new URL(resolution.url), fromFile)
}

const parseModule = (id, moduleUrl, op) => {
  let module = cache.get(id)

  if (!module) {
    try {
      module = op(id)
    } catch (e) {
      throw Error(`while parsing code for '${id}'; reason: ${e.message}`)
    }

    if (moduleUrl) {
      module.url = moduleUrl
    }

    cache.set(id, module)
  }

  return module
}

const builtinLinkResolve = (specifier, referrer) => {
  const prefix = 'node:'
  const id = specifier.replace(prefix, '')

  if (!builtinsSet.has(id)) {
    throw Error(`import specifier '${specifier}' is not a builtin`)
  }

  let moduleUrl

  if (url) {
    moduleUrl = new URL(`node:${id}`)
  }

  return parseModule(id, moduleUrl, fromBuiltin)
}

const load = (specifier, referrer, linkResolve) => {
  let linked
  let caught

  const module = linkResolve(specifier, referrer)

  if (getState(module) === STATE_EVALUATED) {
    return module
  }

  try {
    linked = link(module, linkResolve)
  } catch (e) {
    caught = e
  }

  if (!linked) {
    throw Error(`while linking ${module.id} ${caught ? caught.toString() : 'link = false'}`)
  }

  try {
    evaluate(module)
  } catch (e) {
    throw Error(`while evaluating ${module.id} ${e.toString()}`)
  }

  return module
}

const loadBuiltin = (id) => exports(load(id, null, builtinLinkResolve))

const createRequire = (pathOrUrl) => {
  let context

  if (typeof pathOrUrl === 'string') {
    if (pathOrUrl.startsWith('file:')) {
      context = url.fileURLToPath(pathOrUrl)
    } else if (path.isAbsolute(pathOrUrl)) {
      context = pathOrUrl
    } else {
      throw Error(`string must be a file url or absolute path. got '${pathOrUrl}'`)
    }
  } else {
    // if not a string, should be a URL.
    context = url.fileURLToPath(pathOrUrl)
  }

  context = path.dirname(context)

  const resolve = (id) => {
    if (typeof id !== 'string') {
      throw Error(`Expected argument id to be a string.`)
    }

    const { isAbsolute, join } = path
    let resolved

    if (isAbsolute(id)) {
      resolved = id
    } else if (id[0] === '.') {
      resolved = join(context, id)
    }

    if (!resolved) {
      throw Error(`CommonJS: specifier '${id} could not resolve to a filename`)
    }

    if (!path.extname(resolved)) {
      throw Error(`CommonJS: resolved file '${resolved}' does not have an extension`)
    }

    return resolved
  }

  const require = (specifier) => {
    const filename = resolve(specifier)
    const ext = path.extname(filename)

    switch (ext) {
      // case '.js':
      // case '.cjs':
      //   lib = {}
      //   container = { exports: lib }
      //   cjs(null, filename, path.dirname(filename), createRequire(filename), container, lib)
      //   format = FORMAT_COMMONJS
      //   lib = container.exports
      //   break
      case '.node':
        if (!requireCache.has(filename)) {
          requireCache.set(filename, loadAddon(filename))
        }
        return requireCache.get(filename)
      case '.json':
        if (!requireCache.has(filename)) {
          const parsed = JSON.parse(readFileSync(filename, true /* strip bom, if present */))
          requireCache.set(filename, parsed)
        }
        return requireCache.get(filename)
      default:
        throw Error(`CommonJS: unsupported extension '${ext}'`)
    }
  }

  require.resolve = resolve

  return require
}

const addNodeModulePackage = () => {
  const privateBuiltins = new Set(['napi', 'lexer', 'internal'])
  const builtinModules = Object.freeze(builtins.filter(b => !privateBuiltins.has(b) && !b.startsWith('internal/')))
  const namedExports = {
    builtinModules,
    createRequire
  }
  const exports = {
    default: namedExports,
    ...namedExports
  }
  const module = fromSymbols('module.mjs', Object.keys(exports))

  module.id = 'module'
  module.url = 'node:module'

  evaluateWith(module, exports)

  cache.set(module.id, module)
}

const exports = (key) => {
  if (typeof key === 'string') {
    key = cache.get(key)
  }

  return getNamespace(key)
}

const loadAddon = (filename) => {
  const napi = loadBuiltin('napi').default

  // TODO: --no-addon

  try {
    return napi(filename)
  } catch (e) {
    throw `while loading addon '${filename}' - ${e.message}`
  }
}

const runMain = () => {
  let filename = process.argv[1]

  if (!filename) {
    process._uncaughtException(Error('missing main script file argument'))
    return
  }

  try {
    load(url.pathToFileURL(filename).href, null, linkResolve)
  } catch (e) {
    process._onUncaughtException(e)
  }
}

const bootstrap = () => {
  const { emitReady, on } = import.meta.native
  const globalPolluters = [ 'buffer', 'console', 'process', 'timers', 'internal/event_target', 'url' ]

  addNodeModulePackage()

  globalPolluters.forEach(loadBuiltin)

  path = loadBuiltin('path')
  url = loadBuiltin('url')
  esm = loadBuiltin('internal/esm')

  const { URL } = url

  // some builtins set url to string because URL was not available. cast those url strings to URL here.
  cache.forEach(module => {
    if (typeof module.url === 'string') {
      module.url = new URL(module.url)
    }
  })

  on('import', (specifier, referrerId) => load(specifier, cache.get(referrerId), linkResolve))

  on('destroy', () => {
    cache.clear()
    requireCache.clear()
    path = url = null
  })

  emitReady()
}

// install node:module and initialize environment
bootstrap()

// run the script the user provided on the commandline
runMain()

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
