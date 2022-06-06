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
#include "jerryscript-debugger.h"
#include <mbedtls/version.h>

#if defined(__linux__)
#include <linux/limits.h>
#elif defined(__APPLE__)
#include <sys/syslimits.h>
#elif defined(WIN32)
#ifndef PATH_MAX
#include <windows.h>
#define PATH_MAX MAX_PATH
#endif
#endif

#define NANOS_PER_SEC 1000000000

#ifdef JERRY_DEBUGGER
// Callback function for debugger_get_source
static jerry_value_t wait_for_source_callback(
    const jerry_char_t* resource_name_p, size_t resource_name_size,
    const jerry_char_t* source_p, size_t size, void* data) {
  IOTJS_UNUSED(data);

  jerry_value_t ret_val = jerry_array(2);
  jerry_value_t res;
  jerry_value_t jname =
      jerry_create_string_sz(resource_name_p, resource_name_size);
  jerry_value_t jsource = jerry_create_string_sz(source_p, size);
  res = jerry_object_set_index(ret_val, 0, jname);
  jerry_value_free(res);
  res = jerry_object_set_index(ret_val, 1, jsource);
  jerry_value_free(res);

  jerry_value_free(jname);
  jerry_value_free(jsource);

  return ret_val;
}


// Export JS module received from the debugger client
JS_FUNCTION(debugger_get_source) {
  jerry_debugger_wait_for_source_status_t receive_status;
  jerry_value_t ret_val = jerry_array(0);
  uint8_t counter = 0;
  do {
    jerry_value_t res;
    jerry_value_t set;
    receive_status =
        jerry_debugger_wait_for_client_source(wait_for_source_callback, NULL,
                                              &res);

    if (receive_status == JERRY_DEBUGGER_SOURCE_RECEIVED) {
      set = jerry_object_set_index(ret_val, counter++, res);
      jerry_value_free(set);
      jerry_value_free(res);
    }

    if (receive_status == JERRY_DEBUGGER_CONTEXT_RESET_RECEIVED) {
      iotjs_environment_config(iotjs_environment_get())
          ->debugger->context_reset = true;
      break;
    }
  } while (receive_status != JERRY_DEBUGGER_SOURCE_END);

  return ret_val;
}
#endif


JS_FUNCTION(proc_cwd) {
  char path[IOTJS_MAX_PATH_SIZE];
  size_t size_path = sizeof(path);
  int err = uv_cwd(path, &size_path);
  if (err) {
    return JS_CREATE_ERROR(COMMON, "cwd error");
  }

  return jerry_string_sz(path);
}


JS_FUNCTION(hrtime) {
  uint64_t t = uv_hrtime();
  jerry_value_t result = jerry_array(3);
  jerry_value_t num;

  num = jerry_number((double)((t / NANOS_PER_SEC) >> 32));
  iotjs_jval_set_property_by_index(
      result,
      0,
      num
  );
  jerry_value_free(num);

  num = jerry_number((double)((t / NANOS_PER_SEC) & 0xffffffff));
  iotjs_jval_set_property_by_index(
      result,
      1,
      num
  );
  jerry_value_free(num);

  num = jerry_number((double)(t % NANOS_PER_SEC));
  iotjs_jval_set_property_by_index(
      result,
      2,
      num
  );
  jerry_value_free(num);

  return result;
}

JS_FUNCTION(proc_chdir) {
  DJS_CHECK_ARGS(1, string);

  iotjs_string_t path = JS_GET_ARG(0, string);
  jerry_value_t result;

  if (uv_chdir(iotjs_string_data(&path)) == 0) {
    result = jerry_undefined();
  } else {
    result = JS_CREATE_ERROR(COMMON, "chdir error");
  }

  iotjs_string_destroy(&path);

  return result;
}

JS_FUNCTION(proc_do_exit) {
  iotjs_environment_t* env = iotjs_environment_get();

  if (!iotjs_environment_is_exiting(env)) {
    DJS_CHECK_ARGS(1, number);
    int exit_code = JS_GET_ARG(0, number);

    iotjs_set_process_exitcode(exit_code);
    iotjs_environment_set_state(env, kExiting);
  }
  return jerry_undefined();
}


static void set_process_env(jerry_value_t process) {
  uv_env_item_t* items;
  int32_t count;

  if (uv_os_environ(&items, &count) != 0) {
    return;
  }

  jerry_value_t env = jerry_object();

  for (int32_t i = 0; i < count; i++) {
    iotjs_jval_set_property_jval(env, items[i].name, jerry_string_sz(items[i].value));
  }

  iotjs_jval_set_property_jval(process, IOTJS_MAGIC_STRING_ENV, env);
  jerry_value_free(env);
  uv_os_free_environ(items, count);
}

static void set_process_argv(jerry_value_t process) {
  const iotjs_environment_t* env = iotjs_environment_get();
  uint32_t argc = iotjs_environment_argc(env);

  jerry_value_t argv = jerry_array(argc);

  for (uint32_t i = 0; i < argc; ++i) {
    const char* argvi = iotjs_environment_argv(env, i);
    jerry_value_t arg = jerry_string_sz(argvi);
    iotjs_jval_set_property_by_index(argv, i, arg);
    jerry_value_free(arg);
  }
  iotjs_jval_set_property_jval(process, IOTJS_MAGIC_STRING_ARGV, argv);

  jerry_value_free(argv);
}

static void set_process_exec_path(jerry_value_t process) {
  char exec_path[1024];
  size_t size = sizeof(exec_path) / sizeof(char);

  if (uv_exepath(exec_path, &size) == 0) {
    iotjs_jval_set_property_string_raw(process, IOTJS_MAGIC_STRING_EXEC_PATH, exec_path);
  }
}

static void set_process_versions(jerry_value_t process) {
  char buffer[256];
  jerry_length_t length = 1;
  jerry_value_t versions = jerry_array(length);
  jerry_value_t object;
  int32_t i = 0;

  object = jerry_object();
  sprintf(buffer, "%s.%s.%s",
          STRINGIFY(HTTP_PARSER_VERSION_MAJOR),
          STRINGIFY(HTTP_PARSER_VERSION_MINOR),
          STRINGIFY(HTTP_PARSER_VERSION_PATCH));
  iotjs_jval_set_property_string_raw(object, "http-parser", buffer);
  iotjs_jval_set_property_by_index(versions, i++, object);
  jerry_value_free(object);

  object = jerry_object();
  sprintf(buffer, "%s.%s.%s",
          STRINGIFY(UV_VERSION_MAJOR),
          STRINGIFY(UV_VERSION_MINOR),
          STRINGIFY(UV_VERSION_PATCH));
  iotjs_jval_set_property_string_raw(object, "libtuv", buffer);
  iotjs_jval_set_property_by_index(versions, i++, object);
  jerry_value_free(object);

  object = jerry_object();
  sprintf(buffer, "%s.%s.%s",
          STRINGIFY(JERRY_API_MAJOR_VERSION),
          STRINGIFY(JERRY_API_MINOR_VERSION),
          STRINGIFY(JERRY_API_PATCH_VERSION));
  iotjs_jval_set_property_string_raw(object, "jerryscript", buffer);
  iotjs_jval_set_property_by_index(versions, i++, object);
  iotjs_jval_set_property_by_index(versions, i++, object);
  jerry_value_free(object);

  object = jerry_object();
  iotjs_jval_set_property_string_raw(object, "mbedtls", MBEDTLS_VERSION_STRING);
  iotjs_jval_set_property_by_index(versions, i++, object);
  jerry_value_free(object);

  iotjs_jval_set_property_jval(process, IOTJS_MAGIC_STRING_VERSIONS, versions);
  jerry_value_free(versions);
}

jerry_value_t iotjs_init_process(void) {
  jerry_value_t process = jerry_object();
#ifdef DEBUG
  bool debug = true;
#else
  bool debug = false;
#endif

  // process.cwd()
  iotjs_jval_set_method(process, IOTJS_MAGIC_STRING_CWD, proc_cwd);
  // process.chdir()
  iotjs_jval_set_method(process, IOTJS_MAGIC_STRING_CHDIR, proc_chdir);
  // process.doExit()
  iotjs_jval_set_method(process, IOTJS_MAGIC_STRING_DOEXIT, proc_do_exit);
  // process.hrtime()
  iotjs_jval_set_method(process, IOTJS_MAGIC_STRING_HRTIME, hrtime);
  // process.debug
  iotjs_jval_set_property_jval(process, IOTJS_MAGIC_STRING_DEBUG, jerry_boolean(debug));
  // process.pid
  iotjs_jval_set_property_jval(process, IOTJS_MAGIC_STRING_PID, jerry_number(uv_os_getpid()));
  // process.platform
  iotjs_jval_set_property_string_raw(process, IOTJS_MAGIC_STRING_PLATFORM, TARGET_OS);
  // process.arch
  iotjs_jval_set_property_string_raw(process, IOTJS_MAGIC_STRING_ARCH, TARGET_ARCH);
  // process.argv0
  iotjs_jval_set_property_string_raw(process, IOTJS_MAGIC_STRING_ARGV0, iotjs_environment_get()->argv0);
  // process.version
  iotjs_jval_set_property_string_raw(process, IOTJS_MAGIC_STRING_VERSION, VEIL_VERSION_STRING);
  // process.version
  set_process_versions(process);
  // process.execPath
  set_process_exec_path(process);
  // process.env
  set_process_env(process);
  // process.argv
  set_process_argv(process);

#ifdef JERRY_DEBUGGER
  bool wait_source = false;
  if (iotjs_environment_config(iotjs_environment_get())->debugger != NULL) {
    wait_source = iotjs_environment_config(iotjs_environment_get())
                      ->debugger->wait_source;
  }
#endif

  return process;
}
