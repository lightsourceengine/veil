/* Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
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

#include "iotjs_def.h"
#include "iotjs_compatibility.h"
#include "iotjs_module.h"

#define SET_CONSTANT(object, constant)                           \
  do {                                                           \
    iotjs_jval_set_property_number(object, #constant, constant); \
  } while (0)

static void set_fs_constants (jerry_value_t target) {
  SET_CONSTANT(target, O_APPEND);
  SET_CONSTANT(target, O_CREAT);
  SET_CONSTANT(target, O_EXCL);
  SET_CONSTANT(target, O_RDONLY);
  SET_CONSTANT(target, O_RDWR);
  SET_CONSTANT(target, O_SYNC);
  SET_CONSTANT(target, O_TRUNC);
  SET_CONSTANT(target, O_WRONLY);
  SET_CONSTANT(target, S_IFMT);
  SET_CONSTANT(target, S_IFDIR);
  SET_CONSTANT(target, S_IFREG);
} 

jerry_value_t iotjs_init_constants(void) {
  jerry_value_t jexports = jerry_object();

  set_fs_constants(jexports);

  return jexports;
}
