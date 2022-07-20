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
#include "veil_env.h"

#include <stdlib.h>

static veil_env_t current_env;
static bool initialized = false;

static void initialize(veil_env_t* env);

/**
 * Get the singleton instance of veil_env_t.
 */
veil_env_t* veil_env_get(void) {
  if (!initialized) {
    initialize(&current_env);
    initialized = true;
  }
  return &current_env;
}


/**
 * Release the singleton instance of veil_env_t, and debugger config.
 */
void veil_env_release(void) {
  if (!initialized)
    return;

  veil_env_t* env = veil_env_get();
#ifdef JERRY_DEBUGGER
  IOTJS_RELEASE(env->config.debugger);
#endif
  IOTJS_RELEASE(env->argv);
  cstr_drop(&env->esm_loader_script);
  cstr_drop(&env->esm_specifier_resolution);
  cvec_str_drop(&env->esm_conditions);

  if (env->classes) {
    for (size_t i = 0; i < VEIL_ENV_CLASS_ENUM_COUNT; i++) {
      jerry_value_free(env->classes[i]);
    }
    free(env->classes);
  }

  initialized = false;
}

static void initialize(veil_env_t* env) {
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

void veil_env_js_init(veil_env_t* env) {
  IOTJS_ASSERT(env->classes == NULL);

  env->classes = malloc(VEIL_ENV_CLASS_ENUM_COUNT * sizeof(jerry_value_t));

  for (size_t i = 0; i < VEIL_ENV_CLASS_ENUM_COUNT; i++) {
    env->classes[i] = jerry_undefined();
  }
}

uint32_t veil_env_argc(const veil_env_t* env) {
  return env->argc;
}


const char* veil_env_argv(const veil_env_t* env,
                                   uint32_t idx) {
  return env->argv[idx];
}


uv_loop_t* veil_env_loop(const veil_env_t* env) {
  return env->loop;
}


void veil_env_set_loop(veil_env_t* env, uv_loop_t* loop) {
  env->loop = loop;
}


const Config* veil_env_config(const veil_env_t* env) {
  return &env->config;
}


void veil_env_set_state(veil_env_t* env, State s) {
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

bool veil_env_is_exiting(veil_env_t* env) {
  return env->state == kExiting;
}

void veil_env_set_class(veil_env_t* env, veil_env_class_t type, jerry_value_t js_class) {
  IOTJS_ASSERT(env != NULL);
  IOTJS_ASSERT(env->classes != NULL);
  IOTJS_ASSERT(type >= 0 && type < VEIL_ENV_CLASS_ENUM_COUNT);
  IOTJS_ASSERT(jerry_value_is_function(js_class));

  env->classes[type] = jerry_value_copy(js_class);
}

jerry_value_t veil_env_get_class(veil_env_t* env, veil_env_class_t type) {
  IOTJS_ASSERT(env != NULL);
  IOTJS_ASSERT(env->classes != NULL);
  IOTJS_ASSERT(type >= 0 && type < VEIL_ENV_CLASS_ENUM_COUNT);

  jerry_value_t js_class = env->classes[type];

  IOTJS_ASSERT(jerry_value_is_function(js_class));

  return jerry_value_copy(js_class);
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/jerryscript-project/iotjs
 * Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * See the veil LICENSE file for more information.
 */
