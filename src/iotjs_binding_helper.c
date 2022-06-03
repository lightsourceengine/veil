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

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

jerry_value_t get_process() {
  jerry_value_t realm = jerry_current_realm();
  jerry_value_t process = iotjs_jval_get_property(realm, IOTJS_MAGIC_STRING_PROCESS);

  jerry_value_free(realm);

  return process;
}

jerry_value_t call_process_method(const char* method, const jerry_value_t* argv, size_t argc) {
  jerry_value_t process = get_process();
  jerry_value_t callback = iotjs_jval_get_property(process, method);
  jerry_value_t callback_result;
  bool is_function = jerry_value_is_function(callback);

  IOTJS_ASSERT(is_function);

  if (is_function) {
    callback_result = jerry_call(callback, process, argv, argc);
  } else {
    callback_result = jerry_undefined();
  }

  jerry_value_free(process);
  jerry_value_free(callback);

  return callback_result;
}

void iotjs_uncaught_exception(jerry_value_t jexception) {
  jerry_value_t callback_result = call_process_method(
      IOTJS_MAGIC_STRING__ONUNCAUGHTEXCEPTION,
      &jexception,
      1);

  if (jerry_value_is_error(callback_result)) {
    iotjs_environment_t* env = iotjs_environment_get();

    if (!iotjs_environment_is_exiting(env)) {
      iotjs_set_process_exitcode(2);
      iotjs_environment_set_state(env, kExiting);
    }
  }

  jerry_value_free(callback_result);
}


void iotjs_process_emit_exit(int code) {
  jerry_value_t jcode = jerry_number(code);
  jerry_value_t callback_result = call_process_method(
      IOTJS_MAGIC_STRING_EMITEXIT,
      &jcode,
      1);

  if (jerry_value_is_error(callback_result)) {
    iotjs_set_process_exitcode(2);
  }

  jerry_value_free(callback_result);
  jerry_value_free(jcode);
}

// Calls next tick callbacks registered via `process.nextTick()`.
bool iotjs_process_next_tick(void) {
  iotjs_environment_t* env = iotjs_environment_get();

  if (iotjs_environment_is_exiting(env)) {
    return false;
  }

  bool return_value = false;
  jerry_value_t callback_result = call_process_method(IOTJS_MAGIC_STRING__ONNEXTTICK, NULL, 0);

  if (!jerry_value_is_error(callback_result)) {
    return_value = iotjs_jval_as_boolean(callback_result);
  }

  jerry_value_free(callback_result);

  return return_value;
}

// Make a callback for the given `function` with `this_` binding and `args`
// arguments. The next tick callbacks registered via `process.nextTick()`
// will be called after the callback function `function` returns.
void iotjs_invoke_callback(jerry_value_t jfunc, jerry_value_t jthis,
                           const jerry_value_t* jargv, size_t jargc) {
  jerry_value_t result =
      iotjs_invoke_callback_with_result(jfunc, jthis, jargv, jargc);
  jerry_value_free(result);
}

jerry_value_t iotjs_invoke_callback_with_result(jerry_value_t jfunc,
                                                jerry_value_t jthis,
                                                const jerry_value_t* jargv,
                                                size_t jargc) {
  IOTJS_ASSERT(jerry_value_is_function(jfunc));

  // If the environment is already exiting just return an undefined value.
  if (iotjs_environment_is_exiting(iotjs_environment_get())) {
    return jerry_undefined();
  }
  // Calls back the function.
  jerry_value_t jres = jerry_call(jfunc, jthis, jargv, jargc);
  if (jerry_value_is_error(jres)) {
    jerry_value_t errval = jerry_exception_value(jres, false);
    iotjs_uncaught_exception(errval);
    jerry_value_free(errval);
  }

  // Calls the next tick callbacks.
  iotjs_process_next_tick();

  // Return value.
  return jres;
}


int iotjs_process_exitcode(void) {
  jerry_value_t process = get_process();
  jerry_value_t jexitcode = iotjs_jval_get_property(process, IOTJS_MAGIC_STRING_EXITCODE);
  uint8_t exitcode = 0;
  jerry_value_t num_val = jerry_value_to_number(jexitcode);
  if (jerry_value_is_error(num_val)) {
    exitcode = 1;
  } else {
    exitcode = (uint8_t)iotjs_jval_as_number(num_val);
  }

  uint8_t native_exitcode = iotjs_environment_get()->exitcode;
  if (native_exitcode != exitcode && native_exitcode) {
    exitcode = native_exitcode;
  }
  jerry_value_free(num_val);
  jerry_value_free(jexitcode);
  jerry_value_free(process);
  return (int)exitcode;
}


void iotjs_set_process_exitcode(int code) {
  const jerry_value_t process = get_process();
  jerry_value_t jstring = jerry_string_sz(IOTJS_MAGIC_STRING_EXITCODE);
  jerry_value_t jcode = jerry_number(code);
  jerry_value_t ret_val = jerry_object_set(process, jstring, jcode);
  if (jerry_value_is_error(ret_val)) {
    iotjs_environment_get()->exitcode = 1;
  }

  jerry_value_free(ret_val);
  jerry_value_free(jstring);
  jerry_value_free(jcode);
  jerry_value_free(process);
}
