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

export class ERR_INVALID_ARG_TYPE extends Error {
  constructor (name, expected, actual) {
    super()
    this.code = 'ERR_INVALID_ARG_TYPE'
    this.message = `The ${name} argument must be of type ${expected}. Received ${typeof actual}`
  }
}
