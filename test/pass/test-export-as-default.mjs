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

const something = {}

// jerryscript mainline does not support as default, but the LSE fork of jerryscript supports the
// notation. I have doubts whether as default is to spec, but V8 and the ecosystem of tools expect
// as default to work. If as default is not supported, babel and other tools will not work!
export { something as default }
