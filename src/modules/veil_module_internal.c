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

#include "veil_compatibility.h"
#include "iotjs_js.h"
#include "veil_module.h"
#define i_key char
#include <stc/cvec.h>

static void close_fd(uv_loop_t* loop, int32_t fd) {
  uv_fs_t close_req;
  int32_t err = uv_fs_close(loop, &close_req, fd, NULL);

  IOTJS_ASSERT(err == 0);

  if (err == 0) {
    uv_fs_req_cleanup(&close_req);
  }
}

static jerry_value_t get_conditions(veil_env_t* env) {
  jerry_length_t count = (jerry_length_t)cvec_str_size(env->esm_conditions);
  jerry_length_t i;
  jerry_value_t conditions = jerry_array(count);
  jerry_value_t condition;

  for (i = 0; i < count; i++) {
    condition = jerry_string_sz(cstr_str_safe(cvec_str_at(&env->esm_conditions, i)));
    iotjs_jval_set_property_by_index(conditions, i, condition);
    jerry_value_free(condition);
  }

  return conditions;
}

// Used to speed up module loading. Returns an array [string, boolean]
JS_FUNCTION(js_fast_read_package_json) {
  DJS_CHECK_ARGS(1, string);
  cstr path_arg = JS_GET_ARG(0, string);
  const char* path = cstr_str_safe(&path_arg);
  uv_loop_t* loop = veil_env_loop(veil_env_get());
  uv_fs_t open_req;
  int32_t fd;

  if (strlen(path) != cstr_size(path_arg)) {
    // check for a null byte.
    fd = -1;
  } else {
    fd = uv_fs_open(loop, &open_req, path, O_RDONLY, 0, NULL);
    uv_fs_req_cleanup(&open_req);
  }

  cstr_drop(&path_arg);

  if (fd < 0) {
    return jerry_array(0);
  }

  cvec_char chars = cvec_char_init();
  const size_t kBlockSize = 32 << 10;
  int64_t offset = 0;
  int64_t numchars;
  jerry_value_t result;

  do {
    const size_t start = cvec_char_size(chars);

    cvec_char_resize(&chars, start + kBlockSize, '\0');

    uv_buf_t buf;
    buf.base = cvec_char_at_mut(&chars, start);
    buf.len = kBlockSize;

    uv_fs_t read_req;
    numchars = uv_fs_read(loop, &read_req, fd, &buf, 1, offset, NULL);
    uv_fs_req_cleanup(&read_req);

    if (numchars < 0) {
      result = jerry_array(0);
      goto EXIT;
    }
    offset += numchars;
  } while (numchars == kBlockSize);

  size_t start = 0;
  if (offset >= 3 && 0 == memcmp(cvec_char_at_mut(&chars, 0), "\xEF\xBB\xBF", 3)) {
    start = 3;  // Skip UTF-8 BOM.
  }

  const size_t size = offset - start;
  char* p = cvec_char_at_mut(&chars, start);
  char* pe = cvec_char_at_mut(&chars, size);
  char* pos[2];
  char** ppos = &pos[0];

  while (p < pe) {
    char c = *p++;
    if (c == '\\' && p < pe && *p == '"') p++;
    if (c != '"') continue;
    *ppos++ = p;
    if (ppos < &pos[2]) continue;
    ppos = &pos[0];

    char* s = &pos[0][0];
    char* se = &pos[1][-1];  // Exclude quote.
    size_t n = se - s;

    if (n == 4) {
      if (0 == memcmp(s, "main", 4)) break;
      if (0 == memcmp(s, "name", 4)) break;
      if (0 == memcmp(s, "type", 4)) break;
    } else if (n == 7) {
      if (0 == memcmp(s, "exports", 7)) break;
      if (0 == memcmp(s, "imports", 7)) break;
    }
  }

  result = jerry_array(2);

  jerry_value_t json = jerry_string((const jerry_char_t*)cvec_char_at(&chars, start), size, JERRY_ENCODING_UTF8);
  iotjs_jval_set_property_by_index(result, 0, json);
  jerry_value_free(json);

  jerry_value_t contains_keys = jerry_boolean(p < pe ? true : false);
  iotjs_jval_set_property_by_index(result, 1, contains_keys);
  jerry_value_free(contains_keys);

EXIT:
  close_fd(loop, fd);
  cvec_char_drop(&chars);

  return result;
}

// Used to speed up module loading.  Returns 0 if the path refers to
// a file, 1 when it's a directory or < 0 on error (usually -ENOENT.)
// The speedup comes from not creating thousands of Stat and Error objects.
JS_FUNCTION(js_fast_stat) {
  DJS_CHECK_ARGS(1, string);
  cstr path = JS_GET_ARG(0, string);
  uv_loop_t* loop = veil_env_loop(veil_env_get());
  uv_fs_t req;
  int32_t rc = uv_fs_stat(loop, &req, cstr_str_safe(&path), NULL);

  if (rc == 0) {
    const uv_stat_t* const s = req.ptr;
    rc = (s->st_mode & S_IFDIR) != 0;
  }

  uv_fs_req_cleanup(&req);
  cstr_drop(&path);

  return jerry_number(rc);
}

JS_FUNCTION(js_get_option_value) {
  DJS_CHECK_ARGS(1, string);
  cstr name = JS_GET_ARG(0, string);
  jerry_value_t result;
  veil_env_t* env = veil_env_get();

  if (cstr_eq_raw(&name, "--preserve-symlinks")) {
    result = jerry_boolean(env->config.preserve_symlinks);
  } else if (cstr_eq_raw(&name, "--preserve-symlinks-main")) {
    result = jerry_boolean(env->config.preserve_symlinks);
  } else if (cstr_eq_raw(&name, "--no-addons")) {
    result = jerry_boolean(!env->config.enable_napi);
  } else if (cstr_eq_raw(&name, "--loader")) {
    result = jerry_string_sz(cstr_str_safe(&env->esm_loader_script));
  } else if (cstr_eq_raw(&name, "--conditions")) {
    result = get_conditions(env);
  } else if (cstr_eq_raw(&name, "--es-module-specifier-resolution")) {
    result = jerry_string_sz(cstr_str_safe(&env->esm_specifier_resolution));
  } else {
    result = jerry_throw_sz(JERRY_ERROR_COMMON, "unknown option");
  }

  cstr_drop(&name);

  return result;
}

static jerry_value_t get_builtins() {
  size_t i = 0;
  size_t length;
  jerry_value_t result;

  while (js_modules[i++].name) {}

  result = jerry_array(length = i - 1);

  for (i = 0; i < length; i++) {
    jerry_value_t name = jerry_string_sz(js_modules[i].name);

    iotjs_jval_set_property_by_index(result, i, name);
    jerry_value_free(name);
  }

  return result;
}

jerry_value_t veil_init_internal(void) {
  jerry_value_t internal = jerry_object();
  jerry_value_t builtins = get_builtins();

  iotjs_jval_set_method(internal, "fastReadPackageJson", js_fast_read_package_json);
  iotjs_jval_set_method(internal, "fastStat", js_fast_stat);
  iotjs_jval_set_method(internal, "getOptionValue", js_get_option_value);
  veil_module_export_builtin_specifiers(internal);

  jerry_value_free(builtins);

  return internal;
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
