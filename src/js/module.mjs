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
let userLoadHook /* from --loader FILE arg; otherwise undefined */
let userResolveHook /* from --loader FILE arg; otherwise undefined */

const { native } = import.meta

const {
  builtins,
  fromSymbols,
  fromBuiltin,
  fromSource,
  link,
  evaluate,
  evaluateWith,
  getNamespace,
  getRequests,
  getState,
  readFileSync,
  STATE_EVALUATED
} = native

// contains builtin ids with and without the node: scheme prefix
const builtinsSet = new Set(builtins.concat(builtins.map(i => `node:${i}`)))
// id -> Module, where id is the absolute path to the module js file or the builtin id
const cache = new Map()
// id -> Module, where id is the absolute path to the .node or .json file
const requireCache = new Map()
// specifier -> { format, url }
const specifierCache = new Map()
// result returned from defaultLoad() for builtin specifiers
const builtinLoadResult = Object.freeze({ format: 'builtin', source: undefined })

/**
 * Checks if the specifier is for a registered builtin module (private or public).
 *
 * @param {string} specifier raw specifier
 * @returns {boolean} true if registered builtin, otherwise, false
 */
const isBuiltinSpecifier = (specifier) => builtinsSet.has(specifier)

/**
 * Default resolution of an import specifier to a URL and format hint.
 *
 * @param {string} specifier raw user supplied specifier
 * @param {Object} context resolve context
 * @param {function} def defaultResolve function, unused
 * @returns {Promise<{format: string, url: string}>}
 */
const defaultResolve = async (specifier, context, def = undefined) => defaultResolveSync(specifier, context)

const defaultResolveSync = (specifier, context) => {
  if (isBuiltinSpecifier(specifier)) {
    return {
      url: specifier.startsWith('node:') ? specifier : `node:${specifier}`,
      format: 'builtin'
    }
  }

  return esm.resolveSync(specifier, context)
}

/**
 * Default file source loader.
 *
 * Determines how a URL should be interpreted, retrieved, and parsed.
 *
 * @param {string} resolvedUrl resolved URL to load
 * @param {Object} context loading context, containing resolved format
 * @param {function} def defaultLoad function, unused
 * @returns {Promise<{format: ('module'|'builtin'), source: (string|undefined)}>}
 */
const defaultLoad = async (resolvedUrl, context, def = undefined) => defaultLoadSync(resolvedUrl, context)

const defaultLoadSync = (resolvedUrl, context) => {
  const { format } = context

  if (format === 'builtin') {
    // loading of builtin, if necessary, is deferred to link()
    return builtinLoadResult
  }

  if (format !== 'module') {
    throw Error(`Unsupported format: ${format}`)
  }

  return { format, source: readFileSync(url.fileURLToPath(resolvedUrl), false) }
}

/**
 * Import step before the ECMA link().
 *
 * The jerryscript ECMA link() and ECMA evaluate() are synchronous. However, the module loading process
 * has asynchronous parts, particularly user supplied load() and resolve(). The solution is to run the
 * asynchronous work first, populating the cache with unlinked modules. Then, the link() and evaluate()
 * are run synchronously, pulling modules from the cache.
 *
 * The use cases are main script, dynamic import and loader script.
 *
 * The implementation is ECMA spec compliant except for builtin modules, as they might be
 * evaluated out of the order the user imported them in. This should not be an issue, but something
 * to note.
 *
 * @param {string} specifier raw module id
 * @param {Module} referrer parent module
 * @returns {Promise<Module>} module, possibly in the unlinked state
 */
const preLink = async (specifier, referrer) => {
  let resolveResult
  let loadResult
  let resolveContext = { conditions: esm.conditions, parentURL: referrer?.id }
  let loadContext
  let module
  let requests

  resolveResult = specifierCache.get(specifier)

  if (!resolveResult) {
    if (userResolveHook) {
      resolveResult = await userResolveHook(specifier, resolveContext, defaultResolve)
    }

    if (!resolveResult) {
      resolveResult = defaultResolveSync(specifier, resolveContext)
    }

    if (resolveResult.format !== 'module' && resolveResult.format !== 'builtin') {
      throw Error(`resolveHook(): invalid format = '${resolveResult.format}'`)
    }

    if (typeof resolveResult.url !== 'string') {
      throw Error(`resolveHook(): expected url as string`)
    }

    specifierCache.set(specifier, resolveResult)
  }

  module = cache.get(resolveResult.url)

  if (!module) {
    loadContext = { format: resolveResult.format }

    if (userLoadHook) {
      loadResult = await userLoadHook(resolveResult.url, loadContext, defaultLoad)
    }

    if (!loadResult) {
      loadResult = defaultLoadSync(resolveResult.url, loadContext)
    }

    switch (loadResult.format) {
      case 'module':
        if (typeof loadResult.source !== 'string') {
          throw Error(`loadHook(): expected source as string`)
        }
        const id = resolveResult.url

        module = fromSource(id, loadResult.source)
        module.url = new url.URL(id)

        cache.set(id, module);
        break
      case 'builtin':
        if (typeof loadResult.source === 'string') {
          throw Error(`loadHook(): unexpected source for builtin format`)
        }
        break
      default:
        throw Error(`loadHook(): unexpected format '${loadResult.format}'`)
    }
  }

  requests = module ? getRequests(module).map(request => preLink(request, module)) : []

  if (requests && requests.length) {
    await Promise.all(requests)
  }

  return module
}

/**
 * Asynchronously import a module by specifier.
 *
 * @param {string} specifier id
 * @param {Module|null} referrer module that is doing the importing, can be null for loader, main, etc
 * @returns {Promise<Object>} module namespace
 */
const importAsync = async (specifier, referrer) => {
  // short circuit additional async ops when we know its a builtin import
  if (isBuiltinSpecifier(specifier)) {
    return importBuiltin(specifier)
  }

  return exports(loadModule(await preLink(specifier, referrer), fetchRequest))
}

/**
 * Synchronously import a builtin module.
 *
 * @param {string} specifier id with or without node: scheme
 * @returns {Object} builtin module namespace
 */
const importBuiltin = (specifier) => exports(loadModule(fetchBuiltin(specifier), fetchBuiltin))

/**
 * Perform ECMA link() and evaluate() on a module, if necessary.
 *
 * @param {Module} module module to load
 * @param {function} linkFetchRequest callback for link to resolve requests (child imports)
 * @returns {Module}
 */
const loadModule = (module, linkFetchRequest) => {
  if (getState(module) === STATE_EVALUATED) {
    return module
  }

  let linked
  let caught
  let { id } = module

  if (!module.url && url) {
    module.url = new url.URL(id)
  }

  try {
    linked = link(module, linkFetchRequest)
  } catch (e) {
    caught = e
  }

  if (!linked) {
    throw Error(`while linking ${id} ${caught ? caught.toString() : 'link = false'}`)
  }

  try {
    evaluate(module)
  } catch (e) {
    throw Error(`while evaluating ${id} ${e.toString()}`)
  }

  return module
}

const fetchBuiltin = (specifier, referrer) => {
  if (!isBuiltinSpecifier(specifier)) {
    throw Error(`illegal import '${specifier}' from ${referrer?.id}`)
  }

  if (!specifier.startsWith('node:')) {
    specifier = `node:${specifier}`
  }

  let module = cache.get(specifier)

  if (!module) {
    module = fromBuiltin(specifier)
    cache.set(module.id, module)
  }

  return module
}

const fetchRequest = (specifier, referrer) => {
  if (isBuiltinSpecifier(specifier)) {
    return fetchBuiltin(specifier)
  }

  // assumes preLink() has just been called, resolving all the
  // requests of this module and caching the results.
  return cache.get(specifierCache.get(specifier).url)
}

const onDynamicImport = async (specifier, referrerId) => {
  const referrer = cache.get(referrerId)

  if (!referrer) {
    throw Error(`dynamic import unknown referrer: ${referrerId}`)
  }

  return importAsync(specifier, referrer)
}

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
  const id = 'node:module'

  module.id = id

  evaluateWith(module, exports)

  cache.set(id, module)
}

const exports = (key) => {
  if (typeof key === 'string') {
    key = cache.get(key)
  }

  return getNamespace(key)
}

const loadAddon = (filename) => {
  const napi = importBuiltin('napi').default

  // TODO: --no-addon

  try {
    return napi(filename)
  } catch (e) {
    throw `while loading addon '${filename}' - ${e.message}`
  }
}

const runMain = async () => {
  const filename = process.argv[1]
  const loaderSpecifier = esm.getUserLoader()

  if (loaderSpecifier) {
    const loader = await importAsync(loaderSpecifier, null)

    userResolveHook = loader.resolve
    userLoadHook = loader.load
  }

  if (!filename) {
    throw Error('missing main script file argument')
  }

  return importAsync(url.pathToFileURL(filename).href, null)
}

const bootstrap = () => {
  const { emitReady, on } = import.meta.native
  const globalPolluters = [ 'buffer', 'console', 'process', 'timers', 'internal/event_target', 'url' ]

  addNodeModulePackage()

  globalPolluters.forEach(importBuiltin)

  path = importBuiltin('path')
  url = importBuiltin('url')
  esm = importBuiltin('internal/esm')

  // some builtins set url to string because URL was not available. cast those url strings to URL here.
  cache.forEach(module => module.url || (module.url = new url.URL(module.id)))

  on('import', onDynamicImport)

  on('destroy', () => {
    cache.clear()
    requireCache.clear()
    specifierCache.clear()
    path = url = esm = null
  })

  emitReady()
}

// install node:module and initialize environment
bootstrap()

// run the script the user provided on the commandline
runMain().catch(e => {
  process._onUncaughtException(e)
})

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
