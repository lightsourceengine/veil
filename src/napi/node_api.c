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

#include "jerryscript-ext/handle-scope.h"
#include "jerryscript.h"
#include "internal/node_api_internal.h"

static napi_node_version node_version = {
  .major = NODE_MAJOR_VERSION,
  .minor = NODE_MINOR_VERSION,
  .patch = NODE_PATCH_VERSION,
};

napi_status napi_get_node_version(napi_env env,
                                  const napi_node_version** version) {
  NAPI_TRY_ENV(env);
  NAPI_ASSIGN(version, &node_version);
  NAPI_RETURN(napi_ok);
}

napi_status napi_get_version(napi_env env, uint32_t* result) {
  NAPI_TRY_ENV(env);
  NAPI_ASSIGN(result, NAPI_VERSION);
  NAPI_RETURN(napi_ok);
}

napi_status napi_get_uv_event_loop(napi_env env, uv_loop_t** loop) {
  NAPI_TRY_ENV(env);
  uv_loop_t* veil_uv_loop = veil_env_loop(veil_env_get());
  NAPI_ASSIGN(loop, veil_uv_loop);
  NAPI_RETURN(napi_ok);
}

napi_status napi_adjust_external_memory(napi_env env, int64_t change_in_bytes, int64_t* adjusted_value) {
  NAPI_RETURN(napi_ok);
}
