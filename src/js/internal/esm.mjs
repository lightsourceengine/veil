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

import {
  getOptionValue,
  getPackageConfig,
  getPackageScopeConfig,
  getIntrinsicPackageConfig,
  canBeImportedByUsers,
  canBeImportedWithoutScheme,
  fastStat,
  STAT_IS_FILE,
  STAT_IS_DIR
} from 'internal'
import { resolve, extname, basename, relative } from 'path'
import { URL, pathToFileURL, fileURLToPath } from 'url'
import { codes } from 'internal/errors';

const {
  ERR_INVALID_ARG_VALUE,
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ERR_NETWORK_IMPORT_DISALLOWED,
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
  ERR_UNKNOWN_FILE_EXTENSION
} = codes
const ObjectFreeze = Object.freeze
const ObjectGetOwnPropertyNames = Object.getOwnPropertyNames
const JSONStringify = JSON.stringify
const SafeSet = Set
const SafeMap = Map
const ArrayIsArray = Array.isArray
const RegExpPrototypeSymbolReplace = (...args) => RegExp.prototype[Symbol.replace].call(...args)

const preserveSymlinks = getOptionValue('--preserve-symlinks');
const preserveSymlinksMain = getOptionValue('--preserve-symlinks-main');
const useNodeSpecifierResolution = false // TODO: implement --experimental-specifier-resolution
const userConditions = getOptionValue('--conditions');
const noAddons = getOptionValue('--no-addons');
const addonConditions = noAddons ? [] : ['node-addons'];

const DEFAULT_CONDITIONS = ObjectFreeze([
  'node',
  'import',
  ...addonConditions,
  ...userConditions,
]);

const DEFAULT_CONDITIONS_SET = new SafeSet(DEFAULT_CONDITIONS);

/**
 * @typedef {string | string[] | Record<string, unknown>} Exports
 * @typedef {'module' | 'commonjs'} PackageType
 * @typedef {{
 *   pjsonPath: string,
 *   exports?: ExportConfig,
 *   name?: string,
 *   main?: string,
 *   type?: PackageType,
 * }} PackageConfig
 */

const emittedPackageWarnings = new SafeSet();

function emitTrailingSlashPatternDeprecation(match, pjsonUrl, base) {
  const pjsonPath = fileURLToPath(pjsonUrl);
  const key = `pjsonPath + '|' + match`

  if (!emittedPackageWarnings.has(key)) {
    emittedPackageWarnings.add(key);
    notifyDeprecation(
      `${pjsonPath} - deprecated trailing slash pattern mapping in "exports" field`,
      'DEP0155')
  }
}

/**
 * @param {URL} url
 * @param {URL} packageJSONUrl
 * @param {string | URL | undefined} base
 * @param {string} main
 * @returns {void}
 */
function emitLegacyIndexDeprecation(url, packageJSONUrl, base, main) {
  const format = defaultGetFormatWithoutErrors(url, { parentURL: '' });
  if (format !== 'module')
    return;
  const pkgPath = fileURLToPath(new URL('.', packageJSONUrl));

  notifyDeprecation(
    `${pkgPath} - ${ main ? '"main" field missing file ext' : 'no "main" or "exports" field'}`,
    'DEP0151'
  )
}

const notifyDeprecation = (message, code) => process.emitWarning(message, 'DeprecationWarning', code)

/**
 * @param {string[]} [conditions]
 * @returns {Set<string>}
 */
function getConditionsSet(conditions) {
  if (conditions !== undefined && conditions !== DEFAULT_CONDITIONS) {
    if (!ArrayIsArray(conditions)) {
      throw new ERR_INVALID_ARG_VALUE('conditions', conditions, 'expected an array');
    }
    return new SafeSet(conditions);
  }
  return DEFAULT_CONDITIONS_SET;
}

/**
 * @param {string | URL} url
 * @returns {boolean}
 */
const fileExists = (url) => fastStat(url) === STAT_IS_FILE

/**
 * Legacy CommonJS main resolution:
 * 1. let M = pkg_url + (json main field)
 * 2. TRY(M, M.js, M.json, M.node)
 * 3. TRY(M/index.js, M/index.json, M/index.node)
 * 4. TRY(pkg_url/index.js, pkg_url/index.json, pkg_url/index.node)
 * 5. NOT_FOUND
 * @param {URL} packageJSONUrl
 * @param {PackageConfig} packageConfig
 * @param {string | URL | undefined} base
 * @returns {URL}
 */
function legacyMainResolve(packageJSONUrl, packageConfig, base) {
  let guess;
  let { main } = packageConfig

  if (main !== undefined) {
    // Note: fs check redundances will be handled by Descriptor cache here.
    if (fileExists(guess = new URL(`./${main}`,
      packageJSONUrl))) {
      return guess;
    } else if (fileExists(guess = new URL(`./${main}.js`,
      packageJSONUrl)));
    else if (fileExists(guess = new URL(`./${main}.json`,
      packageJSONUrl)));
    else if (fileExists(guess = new URL(`./${main}.node`,
      packageJSONUrl)));
    else if (fileExists(guess = new URL(`./${main}/index.js`,
      packageJSONUrl)));
    else if (fileExists(guess = new URL(`./${main}/index.json`,
      packageJSONUrl)));
    else if (fileExists(guess = new URL(`./${main}/index.node`,
      packageJSONUrl)));
    else guess = undefined;
    if (guess) {
      emitLegacyIndexDeprecation(guess, packageJSONUrl, base, main);
      return guess;
    }
    // Fallthrough.
  }
  if (fileExists(guess = new URL('./index.js', packageJSONUrl)));
  // So fs.
  else if (fileExists(guess = new URL('./index.json', packageJSONUrl)));
  else if (fileExists(guess = new URL('./index.node', packageJSONUrl)));
  else guess = undefined;
  if (guess) {
    emitLegacyIndexDeprecation(guess, packageJSONUrl, base, main);
    return guess;
  }
  // Not found.
  throw new ERR_MODULE_NOT_FOUND(
    fileURLToPath(new URL('.', packageJSONUrl)), fileURLToPath(base));
}

/**
 * @param {URL} search
 * @returns {URL | undefined}
 */
function resolveExtensionsWithTryExactName(search) {
  if (fileExists(search)) return search;
  return resolveExtensions(search);
}

const extensions = ['.js', '.json', '.node', '.mjs'];

/**
 * @param {URL} search
 * @returns {URL | undefined}
 */
function resolveExtensions(search) {
  for (let i = 0; i < extensions.length; i++) {
    const guess = new URL(`${search.pathname}${extensions[i]}`, search);
    if (fileExists(guess)) return guess;
  }
}

/**
 * @param {URL} search
 * @returns {URL | undefined}
 */
function resolveDirectoryEntry(search) {
  const dirPath = fileURLToPath(search);
  const pkgJsonPath = resolve(dirPath, 'package.json');
  if (fileExists(pkgJsonPath)) {
    const packageConfig = getPackageConfig(pkgJsonPath);

    if (typeof packageConfig.main === 'string') {
      const mainUrl = pathToFileURL(resolve(dirPath, packageConfig.main));
      return resolveExtensionsWithTryExactName(mainUrl);
    }
  }
  return resolveExtensions(new URL('index', search));
}

const encodedSepRegEx = /%2F|%5C/i;
/**
 * @param {URL} resolved
 * @param {string | URL | undefined} base
 * @param {boolean} preserveSymlinks
 * @returns {URL | undefined}
 */
function finalizeResolution(resolved, base, preserveSymlinks) {
  if (encodedSepRegEx.exec(resolved.pathname) !== null)
    throw new ERR_INVALID_MODULE_SPECIFIER(
      resolved.pathname, 'must not include encoded "/" or "\\" characters',
      fileURLToPath(base));

  let path = fileURLToPath(resolved);
  if (useNodeSpecifierResolution) {
    let file = resolveExtensionsWithTryExactName(resolved);

    // Directory
    if (file === undefined) {
      file = path.endsWith('/') ?
        (resolveDirectoryEntry(resolved) || resolved) : resolveDirectoryEntry(new URL(`${resolved}/`));

      if (file === resolved) return file;

      if (file === undefined) {
        throw new ERR_MODULE_NOT_FOUND(
          resolved.pathname, fileURLToPath(base), 'module');
      }
    }

    return file
  }

  const stats = fastStat(path.endsWith('/') ? path.slice(-1) : path);
  if (stats === STAT_IS_DIR) {
    const err = new ERR_UNSUPPORTED_DIR_IMPORT(path, fileURLToPath(base));
    err.url = String(resolved);
    throw err;
  } else if (stats !== STAT_IS_FILE) {
    throw new ERR_MODULE_NOT_FOUND(
      path || resolved.pathname, base && fileURLToPath(base), 'module');
  }

  // TODO: implement realpath in fs
  // if (!preserveSymlinks) {
  //   const real = realpathSync(path, {
  //     [internalFS.realpathCacheKey]: realpathCache
  //   });
  //   const { search, hash } = resolved;
  //   resolved = pathToFileURL(real + (path.endsWith(sep) ? '/' : ''));
  //   resolved.search = search;
  //   resolved.hash = hash;
  // }

  return resolved;
}

/**
 * @param {string} specifier
 * @param {URL} packageJSONUrl
 * @param {string | URL | undefined} base
 */
function throwImportNotDefined(specifier, packageJSONUrl, base) {
  throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(
    specifier, packageJSONUrl && fileURLToPath(new URL('.', packageJSONUrl)),
    fileURLToPath(base));
}

/**
 * @param {string} subpath
 * @param {URL} packageJSONUrl
 * @param {string | URL | undefined} base
 */
function throwExportsNotFound(subpath, packageJSONUrl, base) {
  throw new ERR_PACKAGE_PATH_NOT_EXPORTED(
    fileURLToPath(new URL('.', packageJSONUrl)), subpath,
    base && fileURLToPath(base));
}

/**
 *
 * @param {string | URL} subpath
 * @param {URL} packageJSONUrl
 * @param {boolean} internal
 * @param {string | URL | undefined} base
 */
function throwInvalidSubpath(subpath, packageJSONUrl, internal, base) {
  const reason = `request is not a valid subpath for the "${internal ?
    'imports' : 'exports'}" resolution of ${fileURLToPath(packageJSONUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(subpath, reason,
    base && fileURLToPath(base));
}

function throwInvalidPackageTarget(
  subpath, target, packageJSONUrl, internal, base) {
  if (typeof target === 'object' && target !== null) {
    target = JSONStringify(target, null, '');
  } else {
    target = `${target}`;
  }
  throw new ERR_INVALID_PACKAGE_TARGET(
    fileURLToPath(new URL('.', packageJSONUrl)), subpath, target,
    internal, base && fileURLToPath(base));
}

const invalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
const invalidPackageNameRegEx = /^\.|%|\\/;
const patternRegEx = /\*/g;

function resolvePackageTargetString(
  target, subpath, match, packageJSONUrl, base, pattern, internal, conditions) {

  if (subpath !== '' && !pattern && target[target.length - 1] !== '/')
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);

  if (!target.startsWith('./')) {
    if (internal && !target.startsWith('../') && !target.startsWith('/')) {
      let isURL = false;
      try {
        new URL(target);
        isURL = true;
      } catch {
        // Continue regardless of error.
      }
      if (!isURL) {
        const exportTarget = pattern ?
          RegExpPrototypeSymbolReplace(patternRegEx, target, () => subpath) :
          target + subpath;
        return packageResolve(
          exportTarget, packageJSONUrl, conditions);
      }
    }
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);
  }

  if (invalidSegmentRegEx.exec(target.slice(2)) !== null)
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);

  const resolved = new URL(target, packageJSONUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new URL('.', packageJSONUrl).pathname;

  if (!resolvedPath.startsWith(packagePath))
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);

  if (subpath === '') return resolved;

  if (invalidSegmentRegEx.exec(subpath) !== null) {
    const request = pattern ? match.replace('*', () => subpath) : match + subpath;
    throwInvalidSubpath(request, packageJSONUrl, internal, base);
  }

  if (pattern) {
    return new URL(
      RegExpPrototypeSymbolReplace(
        patternRegEx,
        resolved.href,
        () => subpath
      )
    );
  }

  return new URL(subpath, resolved);
}

/**
 * @param {string} key
 * @returns {boolean}
 */
function isArrayIndex(key) {
  const keyNum = +key;
  if (`${keyNum}` !== key) return false;
  return keyNum >= 0 && keyNum < 0xFFFF_FFFF;
}

function resolvePackageTarget(packageJSONUrl, target, subpath, packageSubpath,
  base, pattern, internal, conditions) {
  if (typeof target === 'string') {
    return resolvePackageTargetString(
      target, subpath, packageSubpath, packageJSONUrl, base, pattern, internal,
      conditions);
  } else if (ArrayIsArray(target)) {
    if (target.length === 0) {
      return null;
    }

    let lastException;
    for (let i = 0; i < target.length; i++) {
      const targetItem = target[i];
      let resolveResult;
      try {
        resolveResult = resolvePackageTarget(
          packageJSONUrl, targetItem, subpath, packageSubpath, base, pattern,
          internal, conditions);
      } catch (e) {
        lastException = e;
        if (e.code === 'ERR_INVALID_PACKAGE_TARGET') {
          continue;
        }
        throw e;
      }
      if (resolveResult === undefined) {
        continue;
      }
      if (resolveResult === null) {
        lastException = null;
        continue;
      }
      return resolveResult;
    }
    if (lastException === undefined || lastException === null)
      return lastException;
    throw lastException;
  } else if (target !== null && typeof target === 'object') {
    const keys = ObjectGetOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          fileURLToPath(packageJSONUrl), base,
          '"exports" cannot contain numeric property keys.');
      }
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === 'default' || conditions.has(key)) {
        const conditionalTarget = target[key];
        const resolveResult = resolvePackageTarget(
          packageJSONUrl, conditionalTarget, subpath, packageSubpath, base,
          pattern, internal, conditions);
        if (resolveResult === undefined)
          continue;
        return resolveResult;
      }
    }
    return undefined;
  } else if (target === null) {
    return null;
  }
  throwInvalidPackageTarget(packageSubpath, target, packageJSONUrl, internal,
    base);
}

/**
 *
 * @param {Exports} exports
 * @param {URL} packageJSONUrl
 * @param {string | URL | undefined} base
 * @returns {boolean}
 */
function isConditionalExportsMainSugar(exports, packageJSONUrl, base) {
  if (typeof exports === 'string' || ArrayIsArray(exports)) return true;
  if (typeof exports !== 'object' || exports === null) return false;

  const keys = ObjectGetOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i = 0;
  for (let j = 0; j < keys.length; j++) {
    const key = keys[j];
    const curIsConditionalSugar = key === '' || key[0] !== '.';
    if (i++ === 0) {
      isConditionalSugar = curIsConditionalSugar;
    } else if (isConditionalSugar !== curIsConditionalSugar) {
      throw new ERR_INVALID_PACKAGE_CONFIG(
        fileURLToPath(packageJSONUrl), base,
        '"exports" cannot contain some keys starting with \'.\' and some not.' +
        ' The exports object must either be an object of package subpath keys' +
        ' or an object of main entry condition name keys only.');
    }
  }
  return isConditionalSugar;
}

/**
 * @param {URL} packageJSONUrl
 * @param {string} packageSubpath
 * @param {PackageConfig} packageConfig
 * @param {string | URL | undefined} base
 * @param {Set<string>} conditions
 * @returns {URL}
 */
function packageExportsResolve(
  packageJSONUrl, packageSubpath, packageConfig, base, conditions) {
  let exports = packageConfig.exports;
  if (isConditionalExportsMainSugar(exports, packageJSONUrl, base))
    exports = { '.': exports };
  if (exports.hasOwnProperty(packageSubpath) &&
    !packageSubpath.includes('*') &&
    !packageSubpath.endsWith('/')) {
    const target = exports[packageSubpath];
    const resolveResult = resolvePackageTarget(
      packageJSONUrl, target, '', packageSubpath, base, false, false, conditions
    );

    if (resolveResult == null) {
      throwExportsNotFound(packageSubpath, packageJSONUrl, base);
    }

    return resolveResult;
  }

  let bestMatch = '';
  let bestMatchSubpath;
  const keys = ObjectGetOwnPropertyNames(exports);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const patternIndex = key.indexOf('*');
    if (patternIndex !== -1 && packageSubpath.startsWith(key.slice(0, patternIndex))) {
      // When this reaches EOL, this can throw at the top of the whole function:
      //
      // if (StringPrototypeEndsWith(packageSubpath, '/'))
      //   throwInvalidSubpath(packageSubpath)
      //
      // To match "imports" and the spec.
      if (packageSubpath.endsWith('/'))
        emitTrailingSlashPatternDeprecation(packageSubpath, packageJSONUrl,
          base);
      const patternTrailer = key.slice(patternIndex + 1);
      if (packageSubpath.length >= key.length &&
        packageSubpath.endsWith(patternTrailer) &&
        patternKeyCompare(bestMatch, key) === 1 &&
        key.indexOf('*') === patternIndex) {
        bestMatch = key;
        bestMatchSubpath = packageSubpath.slice(patternIndex,
          packageSubpath.length - patternTrailer.length);
      }
    }
  }

  if (bestMatch) {
    const target = exports[bestMatch];
    const resolveResult = resolvePackageTarget(
      packageJSONUrl,
      target,
      bestMatchSubpath,
      bestMatch,
      base,
      true,
      false,
      conditions);

    if (resolveResult == null) {
      throwExportsNotFound(packageSubpath, packageJSONUrl, base);
    }
    return resolveResult;
  }

  throwExportsNotFound(packageSubpath, packageJSONUrl, base);
}

function patternKeyCompare(a, b) {
  const aPatternIndex = a.indexOf('*');
  const bPatternIndex = b.indexOf('*');
  const baseLenA = aPatternIndex === -1 ? a.length : aPatternIndex + 1;
  const baseLenB = bPatternIndex === -1 ? b.length : bPatternIndex + 1;
  if (baseLenA > baseLenB) return -1;
  if (baseLenB > baseLenA) return 1;
  if (aPatternIndex === -1) return 1;
  if (bPatternIndex === -1) return -1;
  if (a.length > b.length) return -1;
  if (b.length > a.length) return 1;
  return 0;
}

/**
 * @param {string} name
 * @param {string | URL | undefined} base
 * @param {Set<string>} conditions
 * @returns {URL}
 */
function packageImportsResolve(name, base, conditions) {
  if (name === '#' || name.startsWith('#/') || name.endsWith('/')) {
    const reason = 'is not a valid internal imports specifier name';
    throw new ERR_INVALID_MODULE_SPECIFIER(name, reason, fileURLToPath(base));
  }
  let packageJSONUrl;
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    packageJSONUrl = pathToFileURL(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (imports.hasOwnProperty(name) && !name.includes('*')) {
        const resolveResult = resolvePackageTarget(
          packageJSONUrl, imports[name], '', name, base, false, true, conditions
        );
        if (resolveResult != null) {
          return resolveResult;
        }
      } else {
        let bestMatch = '';
        let bestMatchSubpath;
        const keys = ObjectGetOwnPropertyNames(imports);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const patternIndex = key.indexOf('*');
          if (patternIndex !== -1 && name.startsWith(key.slice(0, patternIndex))) {
            const patternTrailer = key.slice(patternIndex + 1);
            if (name.length >= key.length &&
              name.endsWith(patternTrailer) &&
              patternKeyCompare(bestMatch, key) === 1 &&
              key.lastIndexOf('*') === patternIndex) {
              bestMatch = key;
              bestMatchSubpath = name.slice(patternIndex, name.length - patternTrailer.length);
            }
          }
        }

        if (bestMatch) {
          const target = imports[bestMatch];
          const resolveResult = resolvePackageTarget(packageJSONUrl, target,
            bestMatchSubpath,
            bestMatch, base, true,
            true, conditions);
          if (resolveResult != null) {
            return resolveResult;
          }
        }
      }
    }
  }
  throwImportNotDefined(name, packageJSONUrl, base);
}

/**
 * @param {URL} url
 * @returns {PackageType}
 */
function getPackageType(url) {
  const packageConfig = getPackageScopeConfig(url);
  return packageConfig.type;
}

/**
 * @param {string} specifier
 * @param {string | URL | undefined} base
 * @returns {{ packageName: string, packageSubpath: string, isScoped: boolean }}
 */
function parsePackageName(specifier, base) {
  let separatorIndex = specifier.indexOf('/');
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === '@') {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) {
      validPackageName = false;
    } else {
      separatorIndex = specifier.indexOf('/', separatorIndex + 1);
    }
  }

  const packageName = separatorIndex === -1 ?
    specifier : specifier.slice(0, separatorIndex);

  // Package name cannot have leading . and cannot have percent-encoding or
  // \\ separators.
  if (invalidPackageNameRegEx.exec(packageName) !== null)
    validPackageName = false;

  if (!validPackageName) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier, 'is not a valid package name', fileURLToPath(base));
  }

  const packageSubpath = '.' + (separatorIndex === -1 ? '' : specifier.slice(separatorIndex));

  return { packageName, packageSubpath, isScoped };
}

/**
 * @param {string} specifier
 * @param {string | URL | undefined} base
 * @param {Set<string>} conditions
 * @returns {resolved: URL, format? : string}
 */
function packageResolve(specifier, base, conditions) {
  if (canBeImportedByUsers(specifier) && canBeImportedWithoutScheme(specifier)) {
    return new URL(`node:${specifier}`);
  }

  const { packageName, packageSubpath, isScoped } = parsePackageName(specifier, base);

  let packageConfig = getIntrinsicPackageConfig(packageName, specifier, base)

  if (packageConfig.exists) {
    const packageJSONUrl = pathToFileURL(packageConfig.pjsonPath);

    if (packageConfig.exports !== undefined && packageConfig.exports !== null) {
      return packageExportsResolve(
        packageJSONUrl, packageSubpath, packageConfig, base, conditions);
    }

    if (packageSubpath === '.') {
      return legacyMainResolve(
        packageJSONUrl,
        packageConfig,
        base
      );
    }

    return new URL(packageSubpath, packageJSONUrl);
  }

  // ResolveSelf
  packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    const packageJSONUrl = pathToFileURL(packageConfig.pjsonPath);
    if (packageConfig.name === packageName &&
      packageConfig.exports !== undefined && packageConfig.exports !== null) {
      return packageExportsResolve(
        packageJSONUrl, packageSubpath, packageConfig, base, conditions);
    }
  }

  let packageJSONUrl =
    new URL('./node_modules/' + packageName + '/package.json', base);
  let packageJSONPath = fileURLToPath(packageJSONUrl);
  let lastPath;
  do {
    const stat = fastStat(packageJSONPath.slice(0, packageJSONPath.length - 13));
    if (stat !== STAT_IS_DIR) {
      lastPath = packageJSONPath;
      packageJSONUrl = new URL((isScoped ?
          '../../../../node_modules/' : '../../../node_modules/') +
        packageName + '/package.json', packageJSONUrl);
      packageJSONPath = fileURLToPath(packageJSONUrl);
      continue;
    }

    // Package match.
    const packageConfig = getPackageConfig(packageJSONPath, specifier, base);
    if (packageConfig.exports !== undefined && packageConfig.exports !== null) {
      return packageExportsResolve(
        packageJSONUrl, packageSubpath, packageConfig, base, conditions);
    }
    if (packageSubpath === '.') {
      return legacyMainResolve(
        packageJSONUrl,
        packageConfig,
        base
      );
    }

    return new URL(packageSubpath, packageJSONUrl);
    // Cross-platform root check.
  } while (packageJSONPath.length !== lastPath.length);

  // eslint can't handle the above code.
  // eslint-disable-next-line no-unreachable
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base));
}

function isRelativeSpecifier(specifier) {
  if (specifier[0] === '.') {
    if (specifier.length === 1 || specifier[1] === '/') return true;
    if (specifier[1] === '.') {
      if (specifier.length === 2 || specifier[2] === '/') return true;
    }
  }
  return false;
}

function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === '') return false;
  if (specifier[0] === '/') return true;
  return isRelativeSpecifier(specifier);
}

const isRemoteURL = ({ protocol }) => protocol === 'http:' || protocol === 'https:'

/**
 * @param {string} specifier
 * @param {string | URL | undefined} base
 * @param {Set<string>} conditions
 * @param {boolean} preserveSymlinks
 * @returns {url: URL, format?: string}
 */
function moduleResolve(specifier, base, conditions, preserveSymlinks) {
  const isRemote = base && isRemoteURL(base);
  // Order swapped from spec for minor perf gain.
  // Ok since relative URLs cannot parse as URLs.
  let resolved;
  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
    resolved = new URL(specifier, base);
  } else if (!isRemote && specifier[0] === '#') {
    resolved = packageImportsResolve(specifier, base, conditions);
  } else {
    try {
      resolved = new URL(specifier);
    } catch {
      if (!isRemote) {
        resolved = packageResolve(specifier, base, conditions);
      }
    }
  }
  if (resolved.protocol !== 'file:') {
    return resolved;
  }
  return finalizeResolution(resolved, base, preserveSymlinks);
}

// TODO(@JakobJingleheimer): de-dupe `specifier` & `parsed`
function checkIfDisallowedImport(specifier, parsed, parsedParentURL) {
  if (parsedParentURL) {
    if (isRemoteURL(parsedParentURL)) {
      if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
        // data: and blob: disallowed due to allowing file: access via
        // indirection
        if (parsed &&
          parsed.protocol !== 'https:' &&
          parsed.protocol !== 'http:'
        ) {
          throw new ERR_NETWORK_IMPORT_DISALLOWED(
            specifier,
            parsedParentURL,
            'remote imports cannot import from a local location.'
          );
        }

        return { url: parsed.href };
      }
      if (canBeImportedByUsers(specifier) && canBeImportedWithoutScheme(specifier)) {
        throw new ERR_NETWORK_IMPORT_DISALLOWED(
          specifier,
          parsedParentURL,
          'remote imports cannot import from a local location.'
        );
      }

      throw new ERR_NETWORK_IMPORT_DISALLOWED(
        specifier,
        parsedParentURL,
        'only relative and absolute specifiers are supported.'
      );
    }
  }
}

function throwIfUnsupportedURLProtocol(url) {
  if (!['file:', 'data:', 'node:'].includes(url.protocol)) {
    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(url, [ 'file', 'data', 'node' ]);
  }
}

function throwIfUnsupportedURLScheme(parsed) {
  if (parsed && parsed.protocol !== 'file:' && parsed.protocol !== 'data:') {
    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(parsed, [ 'file', 'data' ]);
  }
}

const resolveSync = (specifier, context) => {
  let { parentURL, conditions } = context;

  const isMain = parentURL === undefined;
  if (isMain) {
    parentURL = pathToFileURL(`${process.cwd()}/`).href;
  }

  let parsedParentURL;
  if (parentURL) {
    try {
      parsedParentURL = new URL(parentURL);
    } catch {
      // Ignore exception
    }
  }

  let parsed;
  try {
    if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
      parsed = new URL(specifier, parsedParentURL);
    } else {
      parsed = new URL(specifier);
    }

    if (parsed.protocol === 'data:') {
      return { url: parsed.href };
    }
  } catch {
    // Ignore exception
  }

  // There are multiple deep branches that can either throw or return; instead
  // of duplicating that deeply nested logic for the possible returns, DRY and
  // check for a return. This seems the least gnarly.
  const maybeReturn = checkIfDisallowedImport(
    specifier,
    parsed,
    parsedParentURL,
  );

  if (maybeReturn) return maybeReturn;

  // This must come after checkIfDisallowedImport
  if (parsed && parsed.protocol === 'node:') return { url: specifier };

  throwIfUnsupportedURLScheme(parsed);

  conditions = getConditionsSet(conditions);
  let url;
  try {
    url = moduleResolve(
      specifier,
      parentURL,
      conditions,
      isMain ? preserveSymlinksMain : preserveSymlinks
    );
  } catch (error) {
    throw error;
  }

  throwIfUnsupportedURLProtocol(url);

  return {
    // Do NOT cast `url` to a string: that will work even when there are real
    // problems, silencing them
    url: url.href,
    format: defaultGetFormatWithoutErrors(url, context),
  };
}

/**
 * @param {URL | URL['href']} url
 * @param {{parentURL: string}} context
 * @returns {string | undefined} only works when enabled
 */
function defaultGetFormatWithoutErrors(url, context) {
  const parsed = new URL(url);
  if (protocolHandlers.has(parsed.protocol))
    return protocolHandlers.get(parsed.protocol)(parsed, context, true);
}

/**
 * @param {URL} url
 * @param {{parentURL: string}} context
 * @param {boolean} ignoreErrors
 * @returns {string}
 */
function getFileProtocolModuleFormat(url, context, ignoreErrors) {
  const filepath = fileURLToPath(url);
  const ext = extname(filepath);
  if (ext === '.js') {
    return getPackageType(url) === 'module' ? 'module' : 'commonjs';
  }

  const format = extensionFormatMap[ext];
  if (format) return format;

  if (useNodeSpecifierResolution) {
    // Explicit undefined return indicates load hook should rerun format check
    if (ignoreErrors) return undefined;
    let suggestion = '';
    if (getPackageType(url) === 'module' && ext === '') {
      const config = getPackageScopeConfig(url);
      const fileBasename = basename(filepath);
      const relativePath = relative(config.pjsonPath, filepath).slice(1);
      suggestion = 'Loading extensionless files is not supported inside of ' +
        '"type":"module" package.json contexts. The package.json file ' +
        `${config.pjsonPath} caused this "type":"module" context. Try ` +
        `changing ${filepath} to have a file extension. Note the "bin" ` +
        'field of package.json can point to a file with an extension, for example ' +
        `{"type":"module","bin":{"${fileBasename}":"${relativePath}.js"}}`;
    }
    throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath, suggestion);
  }

  return legacyExtensionFormatMap[ext] ?? null;
}

/**
 * @param {URL} parsed
 * @returns {string | null}
 */
function getDataProtocolModuleFormat(parsed) {
  const result = dataProtocolRegEx.exec(parsed.pathname)
  return mimeToFormat(result?.[1] ?? '');
}

/**
 * @param {string} mime
 * @returns {string | null}
 */
const mimeToFormat = (mime) => {
  if (mimeJavscriptRegEx.exec(mime) !== null)
    return 'module';
  if (mime === 'application/json')
    return 'json';
  return null;
}

const protocolHandlers = new SafeMap(
  [
    [ 'data:', getDataProtocolModuleFormat ],
    [ 'file:', getFileProtocolModuleFormat ],
    [ 'node:', (url, context, ignoreErrors) => 'builtin' ]
    // remote imports, http and https, not supported
  ]
)
const mimeJavscriptRegEx = /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i
const dataProtocolRegEx = /^([^/]+\/[^;,]+)(?:[^,]*?)(;base64)?,/
const extensionFormatMap = {
  '__proto__': null,
  '.cjs': 'commonjs',
  '.js': 'module',
  '.json': 'json',
  '.mjs': 'module',
};
const legacyExtensionFormatMap = {
  '__proto__': null,
  '.cjs': 'commonjs',
  '.js': 'commonjs',
  '.json': 'commonjs',
  '.mjs': 'module',
  '.node': 'commonjs',
};

const getUserLoader = () => getOptionValue('--loader')

const conditions = DEFAULT_CONDITIONS

export {
  conditions,
  resolveSync,
  getUserLoader
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
