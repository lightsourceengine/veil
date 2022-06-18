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

JS_FUNCTION(os_homedir) {
  char path[PATH_MAX_BYTES];
  size_t size = sizeof(path) / sizeof(char);

  if (uv_os_homedir(path, &size) != 0) {
    path[0] = '\0';
  }

  return jerry_string_sz(path);
}

JS_FUNCTION(os_tmpdir) {
  char path[PATH_MAX_BYTES];
  size_t size = sizeof(path) / sizeof(char);

  if (uv_os_tmpdir(path, &size) != 0) {
    path[0] = '\0';
  }

  return jerry_string_sz(path);
}

JS_FUNCTION(os_hostname) {
  char path[UV_MAXHOSTNAMESIZE];
  size_t size = sizeof(path) / sizeof(char);

  if (uv_os_gethostname(path, &size) != 0) {
    path[0] = '\0';
  }

  return jerry_string_sz(path);
}

jerry_value_t veil_init_os(void) {
  jerry_value_t os = jerry_object();


  iotjs_jval_set_method(os, IOTJS_MAGIC_STRING_HOMEDIR, os_homedir);
  iotjs_jval_set_method(os, IOTJS_MAGIC_STRING_HOSTNAME, os_hostname);
  iotjs_jval_set_method(os, IOTJS_MAGIC_STRING_TMPDIR, os_tmpdir);

  return os;
}
