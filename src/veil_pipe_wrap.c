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
#include "veil_pipe_wrap.h"
#include "veil_handle_wrap.h"
#include "veil_stream_wrap.h"

static void pipe_wrap_finalize(void* native_p, jerry_object_native_info_t* native_info);

static const jerry_object_native_info_t this_module_native_info = { &pipe_wrap_finalize, 0, 0 };

static int32_t pipe_wrap_init(jerry_value_t self, int32_t raw_type) {
  uv_handle_t* handle = veil_uv_create_handle(
      sizeof(uv_pipe_t),
      NULL,
      self,
      &this_module_native_info);
  int32_t err = uv_pipe_init(
      veil_env_loop(veil_env_get()),
      (uv_pipe_t*) handle,
      (raw_type == VEIL_PIPE_SOCKET_TYPE_IPC));

  if (err) {
    jerry_object_delete_native_ptr(self, &this_module_native_info);
  }

  return err;
}

static void pipe_wrap_finalize(void* native_p, jerry_object_native_info_t* native_info) {
  veil_uv_destroy_handle((uv_handle_t*)native_p);
}

static void on_connection(uv_stream_t* server, int status) {
  // TODO: implement
}

JS_FUNCTION(js_constructor) {
  DJS_CHECK_ARGS(1, number);

  int32_t err = pipe_wrap_init(call_info_p->this_value, (int32_t)JS_GET_ARG(0, number));

  if (err) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "pipe_wrap_init() failed");
  }

  return jerry_undefined();
}

JS_FUNCTION(js_bind) {
  DJS_CHECK_ARGS(1, string);
  JS_DECLARE_PTR(call_info_p->this_value, uv_pipe_t, pipe);
  cstr name = JS_GET_ARG(0, string);
  int32_t err = uv_pipe_bind(pipe, cstr_str_safe(&name));

  cstr_drop(&name);

  return jerry_number(err);
}

JS_FUNCTION(js_listen) {
  DJS_CHECK_ARGS(1, number);
  JS_DECLARE_PTR(call_info_p->this_value, uv_pipe_t, pipe);
  int32_t backlog = (int32_t)JS_GET_ARG(0, number);
  int32_t err = uv_listen((uv_stream_t*)pipe, backlog, on_connection);

  return jerry_number(err);
}

JS_FUNCTION(js_connect) {
  // TODO: implement connect
  return jerry_undefined();
}

JS_FUNCTION(js_open) {
  DJS_CHECK_ARGS(1, number);
  JS_DECLARE_PTR(call_info_p->this_value, uv_pipe_t, pipe);
  veil_uv_handle_data* data = pipe->data;
  int32_t fd = (int32_t)JS_GET_ARG(0, number);
  int32_t err = uv_pipe_open(pipe, fd);

  data->extra.windows_fd = fd;

  if (err != 0) {
    jerry_throw_sz(JERRY_ERROR_COMMON, "uv_pipe_open");
  }

  return jerry_undefined();
}

JS_FUNCTION(js_fchmod) {
  DJS_CHECK_ARGS(1, number);
  JS_DECLARE_PTR(call_info_p->this_value, uv_pipe_t, pipe);
  int32_t mode = (int32_t)JS_GET_ARG(0, number);

  int err = uv_pipe_chmod(pipe, mode);

  return jerry_number(err);
}

#ifdef _WIN32
JS_FUNCTION(js_set_pending_instances) {
  DJS_CHECK_ARGS(1, number);
  JS_DECLARE_PTR(call_info_p->this_value, uv_pipe_t, pipe);
  int32_t instances = (int32_t)JS_GET_ARG(0, number);

  uv_pipe_pending_instances(pipe, instances);

  return jerry_undefined();
}
#endif

VEIL_HANDLE_WRAP_BINDINGS(&this_module_native_info)

VEIL_STREAM_WRAP_BINDINGS(&this_module_native_info)

jerry_value_t veil_pipe_wrap_constructor() {
  jerry_value_t constructor = jerry_function_external(js_constructor);
  jerry_value_t prototype = jerry_object();

  iotjs_jval_set_property_number(constructor, "SOCKET", VEIL_PIPE_SOCKET_TYPE_SOCKET);
  iotjs_jval_set_property_number(constructor, "SERVER", VEIL_PIPE_SOCKET_TYPE_SERVER);
  iotjs_jval_set_property_number(constructor, "IPC", VEIL_PIPE_SOCKET_TYPE_IPC);

  iotjs_jval_set_method(prototype, "bind", js_bind);
  iotjs_jval_set_method(prototype, "listen", js_listen);
  iotjs_jval_set_method(prototype, "connect", js_connect);
  iotjs_jval_set_method(prototype, "open", js_open);
  iotjs_jval_set_method(prototype, "fchmod", js_fchmod);
  #ifdef _WIN32
  iotjs_jval_set_method(prototype, "setPendingInstances", js_set_pending_instances);
  #endif

  veil_handle_wrap_mixin(prototype);

  // TODO: implement stream api
  veil_stream_wrap_mixin(prototype);

  iotjs_jval_set_prototype(constructor, prototype);

  jerry_value_free(prototype);

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
