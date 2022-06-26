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

#include <stc/utf8.h>

static bool is_surrogate(uint32_t codepoint) {
  return (codepoint - 0xD800) <= (0xDFFF - 0xD800);
}

JS_FUNCTION(to_usv_string) {
  DJS_CHECK_ARGS(1, string);
  cstr value = JS_GET_ARG(0, string);
  const uint8_t* bytes = (uint8_t*)cstr_str_safe(&value);
  char* target;
  utf8_decode_t state;
  bool replace_surrogates = false;
  jerry_value_t result;

  if (cstr_empty(value)) {
    cstr_drop(&value);
    return jargv[0];
  }

  while (*bytes) {
    bytes = utf8_next(&state, bytes);

    if (is_surrogate(state.codep)) {
      replace_surrogates = true;
      break;
    }
  }

  if (replace_surrogates) {
    bytes = (uint8_t*)cstr_str_safe(&value);
    target = cstr_data(&value);

    while (*bytes) {
      bytes = utf8_next(&state, bytes);

      if (is_surrogate(state.codep)) {
        state.codep = 0xFFFD;
      }

      target += utf8_encode(target, state.codep);
    }

    result = jerry_string((const jerry_char_t*)target, target - cstr_data(&value), JERRY_ENCODING_UTF8);
  } else {
    result = jerry_string((const jerry_char_t*)cstr_data(&value), cstr_size(value), JERRY_ENCODING_UTF8);
  }

  cstr_drop(&value);

  return result;
}

jerry_value_t veil_init_util(void) {
  jerry_value_t util = jerry_object();

  iotjs_jval_set_method(util, IOTJS_MAGIC_STRING_TOUSVSTRING, to_usv_string);

  return util;
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
