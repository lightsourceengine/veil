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

import { spawn } from 'child_process'
import { fail, assert } from 'assert'

const testSpawn = (command, args, options = undefined) => {
  const child = spawn(command, args, options);

  child.on('error', (err) => fail(`Failed with ${err}`))
  child.on('exit', (exitCode) => assert(exitCode === 1));
}

testSpawn(process.execPath, ['--version'], { stdio: 'inherit' });

testSpawn(process.execPath, ['--version'], { stdio: [ 0, 1, 2 ] });

testSpawn(process.execPath, ['--version'], { stdio: [ 'inherit', 'inherit', 'inherit' ] });

testSpawn(process.execPath, ['--version'], { stdio: 'ignore' });

testSpawn(process.execPath, ['--version'], { stdio: [ 'ignore', 'ignore', 'ignore' ] });
