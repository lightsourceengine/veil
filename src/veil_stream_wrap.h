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

// stream_wrap js binding implementation
// due to how native pointers are attached to objects, the bindings must be unique per compilation unit
#define VEIL_STREAM_WRAP_BINDINGS(NATIVE_INFO) \
  JS_FUNCTION(js_stream_wrap_placeholder) { return veil_stream_wrap_placeholder(call_info_p, jargv, jargc, (NATIVE_INFO)); }

// Adds JS methods, declared by VEIL_HANDLE_STREAM_BINDINGS, to a prototype
#define veil_stream_wrap_mixin(PROTOTYPE) \
  iotjs_jval_set_method(PROTOTYPE, "placeholder", js_stream_wrap_placeholder);

// stream_wrap api function signature
#define VEIL_STREAM_WRAP_FUNC(NAME) \
  jerry_value_t veil_stream_wrap_ ## NAME ( \
      const jerry_call_info_t *call_info_p, \
      const jerry_value_t jargv[], \
      jerry_length_t jargc, \
      const jerry_object_native_info_t* native_info)

// handle_wrap api
VEIL_STREAM_WRAP_FUNC(placeholder);

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
