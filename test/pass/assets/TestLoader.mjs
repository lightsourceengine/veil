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

const fromLoaderUrl = 'file:///pkg-from-loader'

export const resolve = async (specifier, context, defaultResolve) => {
  if (specifier === 'pkg-from-loader') {
    return {
      url: fromLoaderUrl,
      format: 'module'
    }
  }
  return defaultResolve(specifier, context, defaultResolve);
};

export const load = async (url, context, defaultLoad) => {
  if (url === fromLoaderUrl) {
    return {
      source: 'export default "TestLoader:pkg-from-loader"',
      format: context.format
    }
  }
  return defaultLoad(url, context, defaultLoad)
}
