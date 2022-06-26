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

#include "iotjs_def.h"
#include "veil_handle_wrap.h"
#include "veil_pipe_wrap.h"

jerry_value_t veil_init_child_process(void) {
  jerry_value_t child_process = jerry_object();

  iotjs_jval_set_property_jval(child_process, "Process", veil_process_wrap_constructor());
  iotjs_jval_set_property_jval(child_process, "Pipe", veil_pipe_wrap_constructor());

  return child_process;
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
