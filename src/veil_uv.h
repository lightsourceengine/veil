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

typedef enum veil_uv_handle_state {
  VEIL_UV_HANDLE_STATE_UNINITIALIZED = 0,
  VEIL_UV_HANDLE_STATE_INITIALIZED,
  VEIL_UV_HANDLE_STATE_CLOSING,
  VEIL_UV_HANDLE_STATE_CLOSED
} veil_uv_handle_state;
typedef void (*veil_uv_close_cb)(uv_handle_t*);

typedef struct veil_uv_handle_data {
  jerry_value_t self;
  veil_uv_close_cb close_cb;
  veil_uv_handle_state state;
  int32_t fd;
} veil_uv_handle_data;

uv_handle_t* veil_uv_create_handle(
    size_t uv_handle_size,
    veil_uv_close_cb close_cb,
    jerry_value_t object,
    const jerry_object_native_info_t* native_info);

void veil_uv_destroy_handle(uv_handle_t* handle);

void veil_uv_handle_mark_initialized(uv_handle_t* handle);
void veil_uv_handle_close(uv_handle_t* handle);
void veil_uv_handle_ref(uv_handle_t* handle);
void veil_uv_handle_unref(uv_handle_t* handle);
bool veil_uv_handle_has_ref(uv_handle_t* handle);
