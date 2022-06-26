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
#include "veil_pipe_wrap.h"

JS_FUNCTION(js_constructor) {
  return jerry_undefined();
}

jerry_value_t veil_pipe_wrap_constructor() {
  jerry_value_t constructor = jerry_function_external(js_constructor);
  jerry_value_t prototype = jerry_object();

  iotjs_jval_set_prototype(constructor, prototype);
  iotjs_jval_set_property_number(constructor, "SOCKET", VEIL_PIPE_SOCKET_TYPE_SOCKET);
  iotjs_jval_set_property_number(constructor, "SERVER", VEIL_PIPE_SOCKET_TYPE_SERVER);
  iotjs_jval_set_property_number(constructor, "IPC", VEIL_PIPE_SOCKET_TYPE_IPC);

  return constructor;
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
