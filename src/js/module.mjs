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

const {
  fromSymbols,
  fromBuiltin,
  fromFile,
  link,
  evaluate,
  evaluateWith,
  getNamespace,
  readFileSync,
  cjs,
  getState,
  STATE_EVALUATED,
  FORMAT_BUILTIN,
  FORMAT_MODULE,
  FORMAT_COMMONJS,
  FORMAT_JSON,
  FORMAT_ADDON
} = import.meta.native

const URL_SCHEME_NODE = 'node:'
// builtin ids used internally that cannot be imported by user scripts
const PRIVATE_BUILTIN_IDS = new Set(['napi', 'lexer'])
// builtin ids importable by import statements
const PUBLIC_BUILTIN_IDS = new Set(import.meta.native.builtins.filter(id => !PRIVATE_BUILTIN_IDS.has(id)))
// builtin modules with known side effects to the global namespace
const GLOBAL_POLLUTERS = [ 'buffer', 'console', 'process', 'timers', 'internal/event_target' ]

// id -> Module, where id is the absolute path to the module js file or the builtin id
const cache = new Map()
// id -> Module, where id is the absolute path to the .node or .json file
const requireCache = new Map()

const asBuiltinId = (specifier, referrer) => {
  const id = specifier.replace(URL_SCHEME_NODE, '')

  if (PUBLIC_BUILTIN_IDS.has(id)) {
    return id
  } else if (!referrer) {
    if (PRIVATE_BUILTIN_IDS.has(id)) {
      return id
    }
  } else if (specifier.startsWith(URL_SCHEME_NODE)) {
    throw Error(`import specifier '${specifier}' is not a known builtin package`)
  }

  // return undefined
}

const asFileId = (specifier, referrer) => {
  const { isAbsolute, dirname, normalize, resolve, extname } = path
  let id

  // TODO: quick and dirty module loading by filename
  if (isAbsolute(specifier)) {
    id = normalize(specifier)
  } else if (specifier.startsWith('.')) {
    if (referrer) {
      id = resolve(dirname(referrer.filename), specifier)
    } else {
      id = resolve(specifier)
    }
  } else {
    // unsupported
  }

  if (id && !extname(id)) {
    throw Error('must specify a file extension')
  }

  // TODO: realpath(id)

  return id
}

const resolve = (specifier, referrer) => {
  let id
  let module
  let parseOp
  let module_url

  id = asBuiltinId(specifier, referrer)

  if (id) {
    parseOp = fromBuiltin
    module_url = `node:${id}` // TODO: use URL?
  } else {
    id = asFileId(specifier, referrer)
    parseOp = fromFile
    module_url = url.pathToFileURL(id)
  }

  if (!id) {
    throw Error(`unsupported import specifier '${specifier}`)
  }

  module = cache.get(id)

  if (!module) {
    try {
      module = parseOp(id)
    } catch (e) {
      throw Error(`while parsing code for '${id}'; reason: ${e.message}`)
    }

    module.url = module_url
    cache.set(id, module)
  }

  return module
}

const load = (specifier, referrer, resolve) => {
  let linked
  let caught

  const module = resolve(specifier, referrer)

  if (getState(module) === STATE_EVALUATED) {
    return module
  }

  try {
    linked = link(module, resolve)
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

const loadBuiltin = (id) => exports(load(id, null, resolve))

const createRequire = (pathOrUrl) => {
  let context

  if (typeof pathOrUrl === 'string') {
    if (pathOrUrl.startsWith('file:')) {
      url.fileURLToPath(pathOrUrl)
    } else if (path.isAbsolute(pathOrUrl)) {
      context = pathOrUrl
    } else {
      throw Error(`string must be a file url or absolute path. got '${pathOrUrl}'`)
    }
  } else {
    // if not a string, should be a URL.
    context = url.fileURLToPath(pathOrUrl)
  }

  const resolve = (id) => {
    const result = asFileId(id, { filename: context })

    if (!result) {
      throw Error(`CommonJS: specifier '${id} could not resolve to a filename`)
    }

    if (!path.extname(result)) {
      throw Error(`CommonJS: resolved file '${result}' does not have an extension`)
    }

    return result
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
          requireCache.set(filename, loadJSON(filename))
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
  const namedExports = {
    builtinModules: Array.from(PUBLIC_BUILTIN_IDS.values()),
    createRequire
  }
  const exports = {
    default: namedExports,
    ...namedExports
  }
  const module = fromSymbols('module.mjs', Object.keys(exports))

  module.id = 'module'
  module.url = 'node:module' // TODO: make URL?

  evaluateWith(module, exports)

  cache.set(module.id, module)
}

class MODULE_NOT_FOUND extends Error {
  constructor (search) {
    super()
    this.message = `Cannot find module '${search}'`
    this.code = 'MODULE_NOT_FOUND'
  }
}

const exports = (key) => {
  if (typeof key === 'string') {
    key = cache.get(key)
  }

  return getNamespace(key)
}

const loadAddon = (filename) => {
  const napi = loadBuiltin('napi').default

  try {
    return napi(filename)
  } catch (e) {
    throw `while loading addon '${filename}' - ${e.message}`
  }
}

const loadJSON = (filename) => JSON.parse(readFileSync(filename, true /* strip bom, if present */))

const runMain = () => {
  let filename = process.argv[1]

  if (!filename) {
    process._uncaughtException(Error('missing main script file argument'))
    return
  }

  const { isAbsolute, sep } = path

  if (!isAbsolute(filename) && !filename.startsWith('.')) {
    filename = `.${sep}${filename}`
  }

  try {
    load(filename, null, resolve)
  } catch (e) {
    process._onUncaughtException(e)
  }
}

const bootstrap = () => {
  const { emitReady, on } = import.meta.native

  addNodeModulePackage()

  GLOBAL_POLLUTERS.forEach(loadBuiltin)

  path = loadBuiltin('path').default
  url = loadBuiltin('url').default

  on('import', (specifier, referrerId) => exports(load(specifier, cache.get(referrerId), resolve)))

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
