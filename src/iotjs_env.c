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
#include "iotjs_env.h"

#include <stdlib.h>

static iotjs_environment_t current_env;
static bool initialized = false;

static void initialize(iotjs_environment_t* env);

/**
 * Get the singleton instance of iotjs_environment_t.
 */
iotjs_environment_t* iotjs_environment_get(void) {
  if (!initialized) {
    initialize(&current_env);
    initialized = true;
  }
  return &current_env;
}


/**
 * Release the singleton instance of iotjs_environment_t, and debugger config.
 */
void iotjs_environment_release(void) {
  if (!initialized)
    return;

  iotjs_environment_t* env = iotjs_environment_get();
#ifdef JERRY_DEBUGGER
  IOTJS_RELEASE(env->config.debugger);
#endif
  IOTJS_RELEASE(env->argv);
  cstr_drop(&env->esm_loader_script);
  cstr_drop(&env->esm_specifier_resolution);
  cvec_str_drop(&env->esm_conditions);
  initialized = false;
}

static void initialize(iotjs_environment_t* env) {
  env->argc = 0;
  env->argv = NULL;
  env->loop = NULL;
  env->state = kInitializing;
  env->config.memstat = false;
  env->config.show_opcode = false;
  env->config.expose_gc = false;
  env->config.enable_napi = true;
#ifdef JERRY_DEBUGGER
  env->config.debugger = NULL;
#endif
  env->exitcode = 0;
  env->time_origin = uv_hrtime();
  env->esm_loader_script = cstr_init();
  env->esm_conditions = cvec_str_init();
  env->esm_specifier_resolution = cstr_from("explicit");
}

uint32_t iotjs_environment_argc(const iotjs_environment_t* env) {
  return env->argc;
}


const char* iotjs_environment_argv(const iotjs_environment_t* env,
                                   uint32_t idx) {
  return env->argv[idx];
}


uv_loop_t* iotjs_environment_loop(const iotjs_environment_t* env) {
  return env->loop;
}


void iotjs_environment_set_loop(iotjs_environment_t* env, uv_loop_t* loop) {
  env->loop = loop;
}


const Config* iotjs_environment_config(const iotjs_environment_t* env) {
  return &env->config;
}


void iotjs_environment_set_state(iotjs_environment_t* env, State s) {
  switch (s) {
    case kInitializing:
      break;
    case kRunningMain:
      IOTJS_ASSERT(env->state == kInitializing);
      break;
    case kRunningLoop:
      IOTJS_ASSERT(env->state == kRunningMain);
      break;
    case kExiting:
      IOTJS_ASSERT(env->state < kExiting);
      break;
    default:
      IOTJS_ASSERT(!"Should not reach here.");
  }
  env->state = s;
}

bool iotjs_environment_is_exiting(iotjs_environment_t* env) {
  return env->state == kExiting;
}
