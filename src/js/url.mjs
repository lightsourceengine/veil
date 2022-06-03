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

import { _internal } from 'util'
import { isAbsolute, join, posix, sep, normalize } from 'path'

const { validateString, ERR_INVALID_ARG_TYPE } = _internal

// TODO: port over the url handling from nodejs. This is a temporary implementation that supports
//       the primary use cases of file urls.

// bare minimum URL implementation for representing file urls.
class URL {
  constructor (protocol, pathname) {
    this._protocol = protocol
    this._pathname = pathname
  }

  get href () {
    return `${this._protocol}//${this._pathname}`
  }

  get origin () {
    return String(null)
  }

  get protocol () {
    return this._protocol
  }

  get username () {
    return ''
  }

  get password () {
    return ''
  }

  get host () {
    return ''
  }

  get hostname () {
    return ''
  }

  get port () {
    return ''
  }

  get pathname () {
    return this._pathname
  }

  get search () {
    return ''
  }

  get searchParams () {
    return {}
  }

  get hash () {
    return ''
  }

  toString () {
    return this.href
  }

  toJSON () {
    return this.href
  }
}

const pathToFileURL = (path) => {
  // Not a full implementation. Just cover the primary cases so that an absolute file url can be created.
  validateString(path, 'path')

  let uri = isAbsolute(path) ? path : join(process.cwd(), path)

  uri = normalize(uri);

  if (process.platform === 'win32') {
    uri = posix.join(uri)
  }

  return new URL('file:', uri)
}

class ERR_INVALID_URL extends Error {
  constructor (input) {
    super(`Invalid URL: ${input}`)
    this.code = 'ERR_INVALID_URL'
  }
}

const fileURLToPath = (url) => {
  // Not a full implementation. Just cover the primary cases so that import.meta.url result can
  // be used by this function.
  const isWindows = process.platform === 'win32'

  if (typeof url === 'string') {
    if (url.startsWith('file:///')) {
      if (isWindows) {
        // file:///C:/path -> C:\path
        return join(url.replace('file:///', ''))
      } else {
        // file:///path -> /path
        return url.replace('file://', '')
      }
    } else if (isWindows && url.startsWith('file://')) {
      // network paths
      // file://nas/path -> \\nas\\path
      return join(url.replace('file://', sep))
    }
  } else if (url instanceof URL) {
    // this 'works' because pathToFileURL only creates absolute file urls
    return normalize(url.pathname)
  } else {
    throw new ERR_INVALID_ARG_TYPE('url', 'string or URL', url)
  }

  throw new ERR_INVALID_URL(url)
}

export { pathToFileURL, fileURLToPath }
export default { pathToFileURL, fileURLToPath }
