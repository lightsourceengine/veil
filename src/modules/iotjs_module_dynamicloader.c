/* Copyright 2018-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "internal/node_api_internal.h"

#include "iotjs_def.h"

JS_FUNCTION(open_native_module) {
  cstr location = JS_GET_ARG(0, string);

  if (!iotjs_environment_get()->config.enable_napi) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "--no-addon flag prevents loading of native addons");
  }

  uv_lib_t lib = {0};
  int status = -1;
  jerry_value_t exports = jerry_undefined();

  if (uv_dlopen(cstr_str_safe(&location), &lib) == 0) {
    status = napi_module_init_pending(&exports);
  }

  switch (status) {
    case napi_module_load_ok:
    case napi_pending_exception:
      break;
    case napi_module_no_nm_register_func:
      exports = jerry_throw_sz(JERRY_ERROR_COMMON, "Module has no declared entry point.");
      break;
    default:
      IOTJS_ASSERT(false && "Failed to load napi addon library.");
      exports = jerry_throw_sz(JERRY_ERROR_COMMON, "Failed to load napi addon library.");
      break;
  }

  uv_dlclose(&lib);
  cstr_drop(&location);

  return exports;
}

jerry_value_t iotjs_init_dynamicloader(void) {
  return jerry_function_external(open_native_module);
}
