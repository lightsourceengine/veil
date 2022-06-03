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

// Legal ECMA. The global namespace contains the property process. The import should effectively create
// a variable named process in the current scope. Jerryscript throws an Error that the export shadows a
// local variable. This import pattern works fine in NodeJS.
//
// Note: "import { process as somethingElse } from 'node:process'" works as expected

import { process } from 'node:process'
