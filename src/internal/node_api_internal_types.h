
/* Copyright 2018-present Rokid Co., Ltd. and other contributors
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

#ifndef VEIL_NODE_API_TYPES_H
#define VEIL_NODE_API_TYPES_H

#include "jerryscript.h"
#include <uv.h>
#include "node_api.h"

typedef void (*veil_cleanup_hook_fn)(void* arg);

typedef struct veil_async_context_s veil_async_context_t;
typedef struct veil_async_work_s veil_async_work_t;
typedef struct veil_buffer_external_info_s veil_buffer_external_info_t;
typedef struct veil_callback_info_s veil_callback_info_t;
typedef struct veil_cleanup_hook_s veil_cleanup_hook_t;
typedef struct veil_function_info_s veil_function_info_t;
typedef struct veil_napi_env_s veil_napi_env_t;
typedef struct veil_object_info_s veil_object_info_t;
typedef struct veil_reference_s veil_reference_t;

typedef enum {
  napi_module_load_ok = 0,

  napi_module_no_pending,
  napi_module_no_nm_register_func,
} napi_module_load_status;

struct veil_cleanup_hook_s {
  veil_cleanup_hook_fn fn;
  void* arg;
  veil_cleanup_hook_t* next;
};

struct veil_buffer_external_info_s {
  napi_env env;
  void* external_data;
  void* finalize_hint;
  napi_finalize finalize_cb;
};

struct veil_reference_s {
  jerry_value_t jval;
  uint32_t refcount;

  veil_reference_t* prev;
  veil_reference_t* next;
};

#define VEIL_OBJECT_INFO_FIELDS \
  napi_env env;                  \
  void* native_object;           \
  napi_finalize finalize_cb;     \
  void* finalize_hint;           \
  veil_reference_t* ref_start;  \
  veil_reference_t* ref_end;

struct veil_object_info_s {
  VEIL_OBJECT_INFO_FIELDS
};

struct veil_function_info_s {
  VEIL_OBJECT_INFO_FIELDS

  napi_callback cb;
  void* data;
};

struct veil_callback_info_s {
  size_t argc;
  jerry_value_t* argv;
  jerry_value_t jval_this;
  jerry_value_t jval_func;

  jerryx_handle_scope handle_scope;
  veil_function_info_t* function_info;
};

struct veil_napi_env_s {
  napi_value pending_exception;
  napi_value pending_fatal_exception;
  napi_extended_error_info extended_error_info;

  /** Common function context */
  veil_callback_info_t* current_callback_info;
  uv_thread_t main_thread;

  veil_cleanup_hook_t* cleanup_hook;
};

struct veil_async_work_s {
  uv_work_t work_req;

  napi_env env;
  napi_value async_resource;
  napi_value async_resource_name;
  napi_async_execute_callback execute;
  napi_async_complete_callback complete;
  void* data;
};

struct veil_async_context_s {
  napi_env env;
  napi_value async_resource;
  napi_value async_resource_name;
};

#endif // VEIL_NODE_API_TYPES_H
