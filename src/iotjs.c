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

#include "iotjs.h"
#include "iotjs_js.h"
#include "iotjs_string_ext.h"
#include "veil_module.h"
#include "jerryscript-ext/debugger.h"
#if ENABLE_MODULE_NAPI
#include "internal/node_api_internal.h"
#endif
#include "jerryscript-port.h"
#include "jerryscript.h"

#include "iotjs_uv_handle.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void on_before_run_main() {
  // TODO: this is called after the JS environment (globals, builtins) has been setup and just
  //       before the user's script is run. the debugger wait source stuff should happen here.
}

JS_FUNCTION(js_garbage_collector) {
  jerry_heap_gc(JERRY_GC_PRESSURE_LOW);

  return jerry_undefined();
}

static bool jerry_initialize(iotjs_environment_t* env) {
  // Set jerry run flags.
  jerry_init_flag_t jerry_flags = JERRY_INIT_EMPTY;

  if (iotjs_environment_config(env)->memstat) {
    jerry_flags |= JERRY_INIT_MEM_STATS;
#if !defined(__NUTTX__) && !defined(__TIZENRT__)
    jerry_log_set_level(JERRY_LOG_LEVEL_DEBUG);
#endif
  }

  if (iotjs_environment_config(env)->show_opcode) {
    jerry_flags |= JERRY_INIT_SHOW_OPCODES;
#if !defined(__NUTTX__) && !defined(__TIZENRT__)
    jerry_log_set_level(JERRY_LOG_LEVEL_DEBUG);
#endif
  }
  // Initialize jerry.
  jerry_init(jerry_flags);

#ifdef JERRY_DEBUGGER
  if (iotjs_environment_config(env)->debugger != NULL) {
    bool protocol_created = false;
    char* debug_protocol = iotjs_environment_config(env)->debugger->protocol;
    char* debug_channel = iotjs_environment_config(env)->debugger->channel;

    if (!strcmp(debug_protocol, "tcp")) {
      uint16_t port = iotjs_environment_config(env)->debugger->port;
      protocol_created = jerryx_debugger_tcp_create(port);
    } else {
      IOTJS_ASSERT(!strcmp(debug_protocol, "serial"));
      char* config = iotjs_environment_config(env)->debugger->serial_config;
      protocol_created = jerryx_debugger_serial_create(config);
    }

    if (!strcmp(debug_channel, "rawpacket")) {
      jerryx_debugger_after_connect(protocol_created &&
                                    jerryx_debugger_rp_create());
    } else {
      IOTJS_ASSERT(!strcmp(debug_channel, "websocket"));
      jerryx_debugger_after_connect(protocol_created &&
                                    jerryx_debugger_ws_create());
    }

    if (!jerry_debugger_is_connected()) {
      DLOG("jerry debugger connection failed");
      return false;
    }

    jerry_debugger_continue();
  }
#endif

  // Set magic strings.
  iotjs_register_jerry_magic_string();

  // Register VM execution stop callback.
  jerry_halt_handler(2, vm_exec_stop_callback, &env->state);

  // Do parse and run to generate initial javascript environment.
  jerry_value_t parsed_code =
      jerry_parse((jerry_char_t*)"", 0, NULL);
  if (jerry_value_is_error(parsed_code)) {
    DLOG("jerry_parse() failed");
    jerry_value_free(parsed_code);
    return false;
  }

  jerry_value_t ret_val = jerry_run(parsed_code);
  if (jerry_value_is_error(ret_val)) {
    DLOG("jerry_run() failed");
    jerry_value_free(parsed_code);
    jerry_value_free(ret_val);
    return false;
  }

  jerry_value_free(parsed_code);
  jerry_value_free(ret_val);
  return true;
}


bool iotjs_initialize(iotjs_environment_t* env) {
  // Initialize JerryScript
  if (!jerry_initialize(env)) {
    DLOG("iotjs_jerry_init failed");
    return false;
  }

  // Set event loop.
  if (!uv_default_loop()) {
    DLOG("iotjs uvloop init failed");
    return false;
  }
  iotjs_environment_set_loop(env, uv_default_loop());

  // Bind environment to global object.
  const jerry_value_t global = jerry_current_realm();
  jerry_object_set_native_ptr(global, NULL, env);

  // Release the global object
  jerry_value_free(global);

  return true;
}

#ifdef JERRY_DEBUGGER
void iotjs_restart(iotjs_environment_t* env, jerry_value_t jmain) {
  jerry_value_t abort_value = jerry_exception_value(jmain, false);
  if (jerry_value_is_string(abort_value)) {
    /* TODO: When there is an api function to check for reset,
    this needs an update. */
    static const char restart_str[] = "r353t";

    jerry_size_t str_size = jerry_get_string_size(abort_value);

    if (str_size == sizeof(restart_str) - 1) {
      jerry_char_t str_buf[5];
      jerry_string_to_char_buffer(abort_value, str_buf, str_size);
      if (memcmp(restart_str, (char*)(str_buf), str_size) == 0) {
        iotjs_environment_config(env)->debugger->context_reset = true;
      }
    }
  }
  jerry_value_free(abort_value);
}
#endif

static bool iotjs_boot() {
  jerry_value_t realm = jerry_current_realm();

  if (iotjs_environment_get()->config.expose_gc) {
    iotjs_jval_set_method(realm, IOTJS_MAGIC_STRING_GC, js_garbage_collector);
  }

  iotjs_jval_set_property_jval(realm, IOTJS_MAGIC_STRING_GLOBAL, realm);

  jerry_value_free(realm);

  jerry_value_t execution_result = veil_module_run(on_before_run_main);
  bool success = !jerry_value_is_exception(execution_result);

  if (!success) {
    iotjs_print_jval(execution_result);
  }

  jerry_value_free(execution_result);

  return success;
}

static int iotjs_start(iotjs_environment_t* env) {
  iotjs_environment_set_state(env, kRunningMain);

#if ENABLE_MODULE_NAPI
  iotjs_setup_napi();
#endif

  // boot: init js environment and run the js file from the commandline
  if (!iotjs_boot()) {
    return 1;
  }

  int exit_code = 0;
  if (!iotjs_environment_is_exiting(env)) {
    // Run event loop.
    iotjs_environment_set_state(env, kRunningLoop);

    bool more;
    do {
      more = uv_run(iotjs_environment_loop(env), UV_RUN_ONCE);
      more |= iotjs_process_next_tick();

      jerry_value_t ret_val = jerry_run_jobs();
      if (jerry_value_is_error(ret_val)) {
        ret_val = jerry_exception_value(ret_val, true);
        iotjs_uncaught_exception(ret_val);
        jerry_value_free(ret_val);
      }

      if (more == false) {
        more = uv_loop_alive(iotjs_environment_loop(env));
      }
    } while (more && !iotjs_environment_is_exiting(env));

    exit_code = iotjs_process_exitcode();

    if (!iotjs_environment_is_exiting(env)) {
      iotjs_process_emit_exit(exit_code);
      iotjs_environment_set_state(env, kExiting);
    }
  }

  exit_code = iotjs_process_exitcode();

  return exit_code;
}

//bool inspect_object (const jerry_value_t object, void *user_data_p) {
//  printf("type: %i\n", jerry_value_type(object));
//
//  if (jerry_value_is_function(object)) {
//    jerry_value_t name = jerry_object_get_sz(object, "name");
//    iotjs_print_jval(name);
//    iotjs_print_jval(object);
//    jerry_value_free(name);
//  } else {
//    // iotjs_print_jval(object);
//  }
//
//  return true;
//}

void iotjs_end(iotjs_environment_t* env) {
  uv_loop_t* loop = iotjs_environment_loop(env);
  // Close uv loop.
  uv_walk(loop, (uv_walk_cb)iotjs_uv_handle_close, NULL);
  uv_run(loop, UV_RUN_DEFAULT);

  int res = uv_loop_close(loop);
  IOTJS_ASSERT(res == 0);
}


void iotjs_terminate(iotjs_environment_t* env) {
  // Release builtin modules.
  iotjs_module_list_cleanup();

#if ENABLE_MODULE_NAPI
  iotjs_cleanup_napi();
#endif

  veil_module_cleanup();

  jerry_module_cleanup(jerry_undefined());

  // jerry_foreach_live_object(inspect_object, NULL);

  jerry_cleanup();
}

int iotjs_entry(int argc, char** argv) {
  int ret_code = 0;

  // Initialize debug log and environments
  iotjs_debuglog_init();
  srand((unsigned)jerry_port_current_time());

  iotjs_environment_t* env = iotjs_environment_get();
  if (!iotjs_environment_parse_command_line_arguments(env, (uint32_t)argc,
                                                      argv)) {
    ret_code = 1;
    goto exit;
  }

  // Initialize IoT.js
  if (!iotjs_initialize(env)) {
    DLOG("iotjs_initialize failed");
    ret_code = 1;
    goto terminate;
  }

  // Start IoT.js
  ret_code = iotjs_start(env);

  // Ends IoT.js
  iotjs_end(env);

terminate:
  iotjs_terminate(env);

exit:
#ifdef JERRY_DEBUGGER
  if (iotjs_environment_config(env)->debugger &&
      iotjs_environment_config(env)->debugger->context_reset) {
    iotjs_environment_release();
    iotjs_debuglog_release();

    return iotjs_entry(argc, argv);
  }
#endif

  iotjs_environment_release();
  iotjs_debuglog_release();
  return ret_code;
}
