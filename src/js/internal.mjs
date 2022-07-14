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

import { join, toNamespacedPath, delimiter } from 'path'
import { fileURLToPath, URL } from 'url'
import { codes } from 'internal/errors'

const { ERR_INVALID_PACKAGE_CONFIG } = codes
const {
  fastReadPackageJson,
  getOptionValue,
  fastStat:fastStatNative,
  builtins
} = import.meta.native

const packageConfigCache = new Map()
const STAT_IS_FILE = 0
const STAT_IS_DIR = 1

const fastStat = (file) => {
  if (file instanceof URL) {
    file = fileURLToPath(file)
  }
  return fastStatNative(file)
}

const getPackageConfig = (path, specifier, base) => {
  const existing = packageConfigCache.get(path);
  if (existing !== undefined) {
    return existing;
  }
  let [source, containsKeys] = fastReadPackageJson(toNamespacedPath(path))

  if (!containsKeys || source === undefined) {
    const packageConfig = {
      pjsonPath: path,
      exists: false,
      main: undefined,
      name: undefined,
      type: 'none',
      exports: undefined,
      imports: undefined,
    };
    packageConfigCache.set(path, packageConfig);
    return packageConfig;
  }

  let packageJSON;
  try {
    packageJSON = JSON.parse(source);
  } catch (error) {
    throw new ERR_INVALID_PACKAGE_CONFIG(
      path,
      (base ? `"${specifier}" from ` : '') + fileURLToPath(base || specifier),
      error.message
    );
  }

  let { exports, imports, main, name, type } = packageJSON;
  if (typeof imports !== 'object' || imports === null) imports = undefined;
  if (typeof main !== 'string') main = undefined;
  if (typeof name !== 'string') name = undefined;
  // Ignore unknown types for forwards compatibility
  if (type !== 'module' && type !== 'commonjs') type = 'none';

  const packageConfig = {
    pjsonPath: path,
    exists: true,
    main,
    name,
    type,
    exports,
    imports,
  };
  packageConfigCache.set(path, packageConfig);
  return packageConfig;
}

const getPackageScopeConfig = (resolved) => {
  let packageJSONUrl = new URL('./package.json', resolved);
  while (true) {
    const packageJSONPath = packageJSONUrl.pathname;
    if (packageJSONPath.endsWith('node_modules/package.json'))
      break;
    const packageConfig = getPackageConfig(fileURLToPath(packageJSONUrl),
      resolved);
    if (packageConfig.exists) return packageConfig;

    const lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL('../package.json', packageJSONUrl);

    // Terminates at root where ../package.json equals ../../package.json
    // (can't just check "/package.json" for Windows support).
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
  }
  const packageJSONPath = fileURLToPath(packageJSONUrl);
  const packageConfig = {
    pjsonPath: packageJSONPath,
    exists: false,
    main: undefined,
    name: undefined,
    type: 'none',
    exports: undefined,
    imports: undefined,
  };
  packageConfigCache.set(packageJSONPath, packageConfig);
  return packageConfig;
}

const allBuiltinsSet = new Set(builtins)

// TODO: honor --expose-internals option
const canBeImportedByUsers = (specifier) => allBuiltinsSet.has(specifier.replace('node:', ''))

// No modules requiring 'node:' scheme at this time
const canBeImportedWithoutScheme = (specifier) => true

const intrinsicPath = (process.env.VEIL_INTRINSIC_PATH ?? '').split(delimiter).filter(Boolean)
const emptyConfig = { exists: false }

const getIntrinsicPackageConfig = (packageName, specifier, base) => {
  for (const p of intrinsicPath) {
    const config = getPackageConfig(join(p, packageName, 'package.json'), specifier, base)

    if (config.exists) {
      return config
    }
  }

  return emptyConfig
}

const realpathCache = new Map()

export {
  fastStat,
  STAT_IS_FILE,
  STAT_IS_DIR,
  getPackageConfig,
  getPackageScopeConfig,
  canBeImportedByUsers,
  canBeImportedWithoutScheme,
  getOptionValue,
  getIntrinsicPackageConfig,
  realpathCache
}
