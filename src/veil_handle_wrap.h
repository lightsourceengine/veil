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

#pragma once

// handle_wrap js binding implementation
// due to how native pointers are attached to objects, the bindings must be unique per compilation unit
#define VEIL_HANDLE_WRAP_BINDINGS(NATIVE_INFO) \
  JS_FUNCTION(js_handle_wrap_close) { return veil_handle_wrap_close(call_info_p, jargv, jargc, (NATIVE_INFO)); } \
  JS_FUNCTION(js_handle_wrap_has_ref) { return veil_handle_wrap_has_ref(call_info_p, jargv, jargc, (NATIVE_INFO)); } \
  JS_FUNCTION(js_handle_wrap_ref) { return veil_handle_wrap_ref(call_info_p, jargv, jargc, (NATIVE_INFO)); } \
  JS_FUNCTION(js_handle_wrap_unref) { return veil_handle_wrap_unref(call_info_p, jargv, jargc, (NATIVE_INFO)); }

#define veil_handle_wrap_mixin_prefix(PROTOTYPE, CLASS) \
  iotjs_jval_set_method(PROTOTYPE, "close", js_ ## CLASS ## _close); \
  iotjs_jval_set_method(PROTOTYPE, "hasRef", js_ ## CLASS ## _has_ref); \
  iotjs_jval_set_method(PROTOTYPE, "ref", js_ ## CLASS ## _ref); \
  iotjs_jval_set_method(PROTOTYPE, "unref", js_ ## CLASS ## _unref)

// Adds JS methods, declared by VEIL_HANDLE_WRAP_BINDINGS, to a prototype
#define veil_handle_wrap_mixin(PROTOTYPE) veil_handle_wrap_mixin_prefix(PROTOTYPE, handle_wrap)

// handle_wrap api function signature
#define VEIL_HANDLE_WRAP_FUNC(NAME) \
  jerry_value_t veil_handle_wrap_ ## NAME ( \
      const jerry_call_info_t *call_info_p, \
      const jerry_value_t jargv[], \
      jerry_length_t jargc, \
      const jerry_object_native_info_t* native_info)

// handle_wrap api
VEIL_HANDLE_WRAP_FUNC(close);
VEIL_HANDLE_WRAP_FUNC(ref);
VEIL_HANDLE_WRAP_FUNC(unref);
VEIL_HANDLE_WRAP_FUNC(has_ref);

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
