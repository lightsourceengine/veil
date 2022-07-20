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

#define NANOS_PER_MILLIS 1e6

JS_FUNCTION(now) {
  uint64_t diff = uv_hrtime() - veil_env_get()->time_origin;

  return jerry_number(diff / NANOS_PER_MILLIS);
}

jerry_value_t veil_init_perf_hooks(void) {
  jerry_value_t perf_hooks = jerry_object();
  jerry_value_t time_origin;

  time_origin = jerry_number(veil_env_get()->time_origin / NANOS_PER_MILLIS);
  iotjs_jval_set_property_jval(
      perf_hooks,
      IOTJS_MAGIC_STRING_TIMEORIGIN,
      time_origin);
  jerry_value_free(time_origin);

  iotjs_jval_set_method(perf_hooks, IOTJS_MAGIC_STRING_NOW, now);

  return perf_hooks;
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
