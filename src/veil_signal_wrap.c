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

#include "veil_signal_wrap.h"
#include "veil_handle_wrap.h"
#include "veil_uv.h"

#define i_tag signal
#define i_key int32_t
#define i_val int64_t
#include <stc/cmap.h>

static void signal_wrap_finalize(void* native_p, jerry_object_native_info_t* native_info);
static void signal_callback(uv_signal_t* handle, int signum);
static void signal_wrap_deactivate(uv_signal_t* signal);

static const jerry_object_native_info_t this_module_native_info = { &signal_wrap_finalize, 0, 0 };
static cmap_signal s_handled_signals = {NULL, NULL, 0, 0, 0.85f};

static int32_t signal_wrap_init(jerry_value_t self) {
  uv_handle_t* handle = veil_uv_create_handle(
      sizeof(uv_signal_t),
      NULL,
      self,
      &this_module_native_info);
  uv_loop_t* loop = iotjs_environment_loop(iotjs_environment_get());
  int32_t err = uv_signal_init(loop, (uv_signal_t*)handle);

  if (err) {
    jerry_object_delete_native_ptr(self, &this_module_native_info);
  } else {
    veil_uv_handle_mark_initialized(handle);
  }

  return err;
}

static int32_t signal_wrap_start(uv_signal_t* signal, int32_t signum) {
  veil_uv_handle_data* data = signal->data;
  int32_t err = uv_signal_start(signal, &signal_callback, signum);

  if (err == 0) {
    IOTJS_ASSERT(!data->extra.signal_active);

    data->extra.signal_active = true;

    cmap_signal_value* value = cmap_signal_get_mut(&s_handled_signals, signum);

    if (value) {
      value->second++;
    } else {
      cmap_signal_insert(&s_handled_signals, signum, 1);
    }
  }

  return err;
}

static int32_t signal_wrap_stop(uv_signal_t* signal) {
  signal_wrap_deactivate(signal);

  return uv_signal_stop(signal);
}

static void signal_callback(uv_signal_t* handle, int signum) {
  veil_uv_handle_data* data = handle->data;
  jerry_value_t jsignum = jerry_number(signum);
  jerry_value_t jonsignal = iotjs_jval_get_property(data->self, "onsignal");

  jerry_value_t result = jerry_call(jonsignal, data->self, &jsignum, 1);

  if (jerry_value_is_exception(result)) {
    iotjs_uncaught_exception(result);
  }

  jerry_value_free(jsignum);
  jerry_value_free(jonsignal);
  jerry_value_free(result);
}

static void signal_wrap_deactivate(uv_signal_t* signal) {
  veil_uv_handle_data* data = signal->data;

  if (data->extra.signal_active) {
    cmap_signal_value* value = cmap_signal_get_mut(&s_handled_signals, signal->signum);

    IOTJS_ASSERT(value);

    value->second--;

    IOTJS_ASSERT(value->second >= 0);

    if (value->second <= 0) {
      cmap_signal_erase(&s_handled_signals, signal->signum);
    }

    data->extra.signal_active = false;
  }
}

static void signal_wrap_finalize(void* native_p, jerry_object_native_info_t* native_info) {
  veil_uv_destroy_handle(native_p);
}

JS_FUNCTION(js_signal_wrap) {
  int32_t err = signal_wrap_init(call_info_p->this_value);

  if (err) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "signal_wrap_init() failed");
  }

  return jerry_undefined();
}

JS_FUNCTION(js_signal_wrap_start) {
  JS_DECLARE_PTR(call_info_p->this_value, uv_signal_t, signal);
  DJS_CHECK_ARGS(1, number);

  return jerry_number(signal_wrap_start(signal, JS_GET_ARG(0, number)));
}

JS_FUNCTION(js_signal_wrap_stop) {
  JS_DECLARE_PTR(call_info_p->this_value, uv_signal_t, signal);

  return jerry_number(signal_wrap_stop(signal));
}

JS_FUNCTION(js_signal_wrap_close) {
  JS_DECLARE_PTR(call_info_p->this_value, uv_signal_t, signal);

  signal_wrap_deactivate(signal);

  return veil_handle_wrap_close(call_info_p, jargv, jargc, &this_module_native_info);
}

JS_FUNCTION(js_signal_wrap_has_ref) {
  return veil_handle_wrap_has_ref(call_info_p, jargv, jargc, &this_module_native_info);
}

JS_FUNCTION(js_signal_wrap_ref) {
  return veil_handle_wrap_ref(call_info_p, jargv, jargc, &this_module_native_info);
}

JS_FUNCTION(js_signal_wrap_unref) {
  return veil_handle_wrap_unref(call_info_p, jargv, jargc, &this_module_native_info);
}

jerry_value_t veil_signal_wrap_constructor() {
  jerry_value_t constructor = jerry_function_external(js_signal_wrap);
  jerry_value_t prototype = jerry_object();
  jerry_value_t onsignal = jerry_null();

  iotjs_jval_set_property_jval(prototype, "onsignal", onsignal);
  iotjs_jval_set_method(prototype, "start", js_signal_wrap_start);
  iotjs_jval_set_method(prototype, "stop", js_signal_wrap_stop);

  veil_handle_wrap_mixin_prefix(prototype, signal_wrap);

  iotjs_jval_set_prototype(constructor, prototype);

  jerry_value_free(prototype);
  jerry_value_free(onsignal);

  return constructor;
}

void veil_signal_wrap_cleanup() {
  cmap_signal_drop(&s_handled_signals);
  s_handled_signals = cmap_signal_init();
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
