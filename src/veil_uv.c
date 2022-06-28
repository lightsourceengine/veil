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

#define ALIGN(value, alignment) (((value) + ((alignment)-1)) & ~((alignment)-1))

uv_handle_t* veil_uv_create_handle(
    size_t uv_handle_size,
    veil_uv_close_cb close_cb,
    jerry_value_t object,
    const jerry_object_native_info_t* native_info) {
  size_t aligned_request_size = ALIGN(uv_handle_size, 8u);
  uint8_t* request_memory;
  uv_handle_t* handle;
  veil_uv_handle_data* data;

  request_memory = calloc(1, aligned_request_size + sizeof(veil_uv_handle_data));
  IOTJS_ASSERT(request_memory != NULL);

  handle = (uv_handle_t*)request_memory;
  handle->data = request_memory + aligned_request_size;

  data = handle->data;
  data->self = jerry_value_copy(object);
  data->close_cb = close_cb;

  jerry_object_set_native_ptr(object, native_info, handle);

  return handle;
}

void veil_uv_destroy_handle(uv_handle_t* handle) {
  free(handle);
}

static void handle_on_close(uv_handle_t* handle) {
  veil_uv_handle_data* data = handle->data;

  IOTJS_ASSERT(data->state == VEIL_UV_HANDLE_STATE_CLOSING);

  if (data->close_cb) {
    data->close_cb(handle);
  }

  data->state = VEIL_UV_HANDLE_STATE_CLOSED;
  jerry_value_free(data->self);
}

void veil_uv_handle_mark_initialized(uv_handle_t* handle) {
  veil_uv_handle_data* data = handle->data;

  IOTJS_ASSERT(data && data->state == VEIL_UV_HANDLE_STATE_UNINITIALIZED);
  data->state = VEIL_UV_HANDLE_STATE_INITIALIZED;
}

void veil_uv_handle_close(uv_handle_t* handle) {
  veil_uv_handle_data* data = handle->data;

  if (data->state != VEIL_UV_HANDLE_STATE_INITIALIZED) {
    return;
  }

  uv_close(handle, handle_on_close);
  data->state = VEIL_UV_HANDLE_STATE_CLOSING;

  // NOTE: node calls self[Symbol(onclose)], veil does not have js code that sets this callback.
}

void veil_uv_handle_ref(uv_handle_t* handle) {
  veil_uv_handle_data* data = handle->data;

  if (data->state == VEIL_UV_HANDLE_STATE_INITIALIZED) {
    uv_ref(handle);
  }
}

void veil_uv_handle_unref(uv_handle_t* handle) {
  veil_uv_handle_data* data = handle->data;

  if (data->state == VEIL_UV_HANDLE_STATE_INITIALIZED) {
    uv_unref(handle);
  }
}

bool veil_uv_handle_has_ref(uv_handle_t* handle) {
  veil_uv_handle_data* data = handle->data;

  if (data->state == VEIL_UV_HANDLE_STATE_INITIALIZED) {
    return uv_has_ref(handle);
  }

  return false;
}
