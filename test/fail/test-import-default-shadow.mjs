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

// Error in jerryscript that the export name shadows a local variable. process is in the GLOBAL namespace,
// so the Error is not correct. The error suggests jerryscript is incorrectly putting imported variables into
// the global namespace, but that is not the case. This needs to be fixed.

import process from 'node:process'
