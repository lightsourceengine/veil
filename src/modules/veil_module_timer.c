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

static void timer_finalize(void* native_p, jerry_object_native_info_t* native_info);

static const jerry_object_native_info_t this_module_native_info = { &timer_finalize, 0, 0 };

static void timer_finalize(void* native_p, jerry_object_native_info_t* native_info) {
  veil_uv_destroy_handle((uv_handle_t*)native_p);
}

int32_t iotjs_timer_object_init(jerry_value_t jtimer) {
  uv_loop_t* loop = veil_env_loop(veil_env_get());
  uv_handle_t* handle = veil_uv_create_handle(
      sizeof(uv_timer_t),
      NULL,
      jtimer,
      &this_module_native_info);
  int32_t err = uv_timer_init(loop, (uv_timer_t*)handle);

  if (err) {
    veil_uv_destroy_handle(handle);
  } else {
    veil_uv_handle_mark_initialized(handle);
  }

  return err;
}


static void timeout_handler(uv_timer_t* handle) {
  IOTJS_ASSERT(handle != NULL);

  veil_uv_handle_data* data = handle->data;
  jerry_value_t jobject = data->self;
  jerry_value_t jcallback =
      iotjs_jval_get_property(jobject, IOTJS_MAGIC_STRING_HANDLETIMEOUT);
  iotjs_invoke_callback(jcallback, jobject, NULL, 0);
  jerry_value_free(jcallback);
}


JS_FUNCTION(timer_start) {
  // Check parameters.
  JS_DECLARE_PTR(call_info_p->this_value, uv_timer_t, timer_handle);
  DJS_CHECK_ARGS(2, number, number);

  // parameters.
  uint64_t timeout = JS_GET_ARG(0, number);
  uint64_t repeat = JS_GET_ARG(1, number);

  // Start timer.
  int res = uv_timer_start(timer_handle, timeout_handler, timeout, repeat);

  return jerry_number(res);
}


JS_FUNCTION(timer_stop) {
  JS_DECLARE_PTR(call_info_p->this_value, uv_handle_t, timer_handle);

  // Stop timer.
  veil_uv_handle_close(timer_handle);

  return jerry_number(0);
}


JS_FUNCTION(timer_constructor) {
  DJS_CHECK_THIS();

  const jerry_value_t jtimer = JS_GET_THIS();

  if (iotjs_timer_object_init(jtimer) != 0) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "error creating timer handle");
  }

  return jerry_undefined();
}


jerry_value_t veil_init_timer(void) {
  jerry_value_t timer = jerry_function_external(timer_constructor);

  jerry_value_t prototype = jerry_object();
  iotjs_jval_set_property_jval(timer, IOTJS_MAGIC_STRING_PROTOTYPE, prototype);

  iotjs_jval_set_method(prototype, IOTJS_MAGIC_STRING_START, timer_start);
  iotjs_jval_set_method(prototype, IOTJS_MAGIC_STRING_STOP, timer_stop);

  jerry_value_free(prototype);

  return timer;
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/jerryscript-project/iotjs
 * Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
