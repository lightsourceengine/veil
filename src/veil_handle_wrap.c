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

#include "veil_uv.h"
#include "veil_handle_wrap.h"

#define DECLARE_UV_HANDLE(NAME) \
  uv_handle_t* NAME; \
  if (!(NAME = jerry_object_get_native_ptr(call_info_p->this_value, native_info))) { \
    return JS_CREATE_ERROR(COMMON, "invalid native ptr"); \
  }

VEIL_HANDLE_WRAP_FUNC(close) {
  DECLARE_UV_HANDLE(handle);

  veil_uv_handle_close(handle);

  return jerry_undefined();
}

VEIL_HANDLE_WRAP_FUNC(has_ref) {
  DECLARE_UV_HANDLE(handle);

  return jerry_boolean(veil_uv_handle_has_ref(handle));
}

VEIL_HANDLE_WRAP_FUNC(ref) {
  DECLARE_UV_HANDLE(handle);

  veil_uv_handle_ref(handle);

  return jerry_undefined();
}

VEIL_HANDLE_WRAP_FUNC(unref) {
  DECLARE_UV_HANDLE(handle);

  veil_uv_handle_unref(handle);

  return jerry_undefined();
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
