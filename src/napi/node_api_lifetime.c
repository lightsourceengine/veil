/* Copyright 2018-present Rokid Co., Ltd. and other contributors
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

#include "jerryscript-ext/handle-scope.h"
#include <stdlib.h>
#include "internal/node_api_internal.h"

VEIL_DEFINE_NATIVE_HANDLE_INFO_THIS_MODULE(object_info);

static void veil_object_info_destroy(void *native_p, struct jerry_object_native_info_t *info_p) {
  veil_object_info_t* info = native_p;
  veil_reference_t* comp = info->ref_start;
  while (comp != NULL) {
    comp->jval = jerry_undefined();
    comp = comp->next;
  }

  if (info->finalize_cb != NULL) {
    info->finalize_cb(info->env, info->native_object, info->finalize_hint);
  }

  IOTJS_RELEASE(info);
}

inline napi_status jerryx_status_to_napi_status(
    jerryx_handle_scope_status status) {
  switch (status) {
    case jerryx_handle_scope_mismatch:
      NAPI_RETURN(napi_handle_scope_mismatch);
    case jerryx_escape_called_twice:
      NAPI_RETURN(napi_escape_called_twice);
    default:
      NAPI_RETURN(napi_ok);
  }
}

veil_object_info_t* veil_get_object_native_info(jerry_value_t jval,
                                                  size_t native_info_size) {
  void* info = jerry_object_get_native_ptr(jval, &this_module_native_info);
  if (!info) {
    info = iotjs_buffer_allocate(native_info_size);
    jerry_object_set_native_ptr(jval, &this_module_native_info, info);
  }

  return (veil_object_info_t*)info;
}

veil_object_info_t* veil_try_get_object_native_info(jerry_value_t jval,
                                                      size_t native_info_size) {
  void* info = jerry_object_get_native_ptr(jval, &this_module_native_info);

  return (veil_object_info_t*)info;
}

napi_status napi_open_handle_scope(napi_env env, napi_handle_scope* result) {
  NAPI_TRY_ENV(env);
  NAPI_WEAK_ASSERT(napi_invalid_arg, result != NULL);

  jerryx_handle_scope_status status;
  status = jerryx_open_handle_scope((jerryx_handle_scope*)result);

  return jerryx_status_to_napi_status(status);
}

napi_status napi_open_escapable_handle_scope(
    napi_env env, napi_escapable_handle_scope* result) {
  NAPI_TRY_ENV(env);
  NAPI_WEAK_ASSERT(napi_invalid_arg, result != NULL);

  jerryx_handle_scope_status status;
  status = jerryx_open_escapable_handle_scope(
      (jerryx_escapable_handle_scope*)result);

  return jerryx_status_to_napi_status(status);
}

napi_status napi_close_handle_scope(napi_env env, napi_handle_scope scope) {
  NAPI_TRY_ENV(env);
  jerryx_handle_scope_status status;
  status = jerryx_close_handle_scope((jerryx_handle_scope)scope);

  return jerryx_status_to_napi_status(status);
}

napi_status napi_close_escapable_handle_scope(
    napi_env env, napi_escapable_handle_scope scope) {
  NAPI_TRY_ENV(env);
  jerryx_handle_scope_status status;
  status =
      jerryx_close_escapable_handle_scope((jerryx_escapable_handle_scope)scope);

  return jerryx_status_to_napi_status(status);
}

napi_status napi_escape_handle(napi_env env, napi_escapable_handle_scope scope,
                               napi_value escapee, napi_value* result) {
  NAPI_TRY_ENV(env);
  NAPI_WEAK_ASSERT(napi_invalid_arg, result != NULL);

  jerryx_handle_scope_status status;
  status =
      jerryx_escape_handle((jerryx_escapable_handle_scope)scope,
                           AS_JERRY_VALUE(escapee), (jerry_value_t*)result);

  return jerryx_status_to_napi_status(status);
}

napi_status napi_create_reference(napi_env env, napi_value value,
                                  uint32_t initial_refcount, napi_ref* result) {
  NAPI_TRY_ENV(env);
  NAPI_WEAK_ASSERT(napi_invalid_arg, result != NULL);

  jerry_value_t jval = AS_JERRY_VALUE(value);
  veil_object_info_t* info =
      veil_get_object_native_info(jval, sizeof(veil_object_info_t));

  veil_reference_t* ref = IOTJS_ALLOC(veil_reference_t);
  ref->refcount = initial_refcount;
  ref->jval = AS_JERRY_VALUE(value);
  ref->next = NULL;

  if (info->ref_start == NULL) {
    ref->prev = NULL;
    info->ref_start = ref;
    info->ref_end = ref;
  } else {
    ref->prev = info->ref_end;

    info->ref_end->next = ref;
    info->ref_end = ref;
  }

  for (uint32_t i = 0; i < ref->refcount; ++i) {
    // avoid unused result warning
    (void)!jerry_value_copy(ref->jval);
  }

  NAPI_ASSIGN(result, (napi_ref)ref);
  NAPI_RETURN(napi_ok);
}

napi_status napi_delete_reference(napi_env env, napi_ref ref) {
  NAPI_TRY_ENV(env);
  veil_reference_t* veil_ref = (veil_reference_t*)ref;
  if (jerry_value_is_object(veil_ref->jval)) {
    jerry_value_t jval = veil_ref->jval;
    veil_object_info_t* info =
        veil_get_object_native_info(jval, sizeof(veil_object_info_t));

    bool found = false;
    veil_reference_t* comp = info->ref_start;
    while (comp != NULL) {
      if (comp == veil_ref) {
        found = true;
        break;
      }
      comp = comp->next;
    }

    NAPI_WEAK_ASSERT(napi_invalid_arg, found);
    if (info->ref_start == veil_ref) {
      info->ref_start = veil_ref->next;
    }
    if (info->ref_end == veil_ref) {
      info->ref_end = veil_ref->prev;
    }
    if (veil_ref->prev != NULL) {
      veil_ref->prev->next = veil_ref->next;
    }
    if (veil_ref->next != NULL) {
      veil_ref->next->prev = veil_ref->prev;
    }
  }

  for (uint32_t i = 0; i < veil_ref->refcount; ++i) {
    jerry_value_free(veil_ref->jval);
  }
  IOTJS_RELEASE(veil_ref);
  NAPI_RETURN(napi_ok);
}

napi_status napi_reference_ref(napi_env env, napi_ref ref, uint32_t* result) {
  NAPI_TRY_ENV(env);
  veil_reference_t* veil_ref = (veil_reference_t*)ref;
  NAPI_WEAK_ASSERT(napi_invalid_arg, jerry_value_is_object(veil_ref->jval));

  // avoid unused result warning
  (void)!jerry_value_copy(veil_ref->jval);
  veil_ref->refcount += 1;

  NAPI_ASSIGN(result, veil_ref->refcount);
  NAPI_RETURN(napi_ok);
}

napi_status napi_reference_unref(napi_env env, napi_ref ref, uint32_t* result) {
  NAPI_TRY_ENV(env);
  veil_reference_t* veil_ref = (veil_reference_t*)ref;
  NAPI_WEAK_ASSERT(napi_invalid_arg, (veil_ref->refcount > 0));

  jerry_value_free(veil_ref->jval);
  veil_ref->refcount -= 1;

  NAPI_ASSIGN(result, veil_ref->refcount);
  NAPI_RETURN(napi_ok);
}

napi_status napi_get_reference_value(napi_env env, napi_ref ref,
                                     napi_value* result) {
  NAPI_TRY_ENV(env);
  veil_reference_t* veil_ref = (veil_reference_t*)ref;
  return napi_assign_nvalue(veil_ref->jval, result);
}

napi_status napi_open_callback_scope(napi_env env, napi_value resource_object,
                                     napi_async_context context,
                                     napi_callback_scope* result) {
  NAPI_TRY_ENV(env);
  return napi_open_handle_scope(env, (napi_handle_scope*)result);
}

napi_status napi_close_callback_scope(napi_env env, napi_callback_scope scope) {
  NAPI_TRY_ENV(env);
  return napi_close_handle_scope(env, (napi_handle_scope)scope);
}

napi_status napi_add_env_cleanup_hook(napi_env env, void (*fun)(void* arg),
                                      void* arg) {
  NAPI_TRY_ENV(env);
  veil_napi_env_t* curr_env = (veil_napi_env_t*)env;
  veil_cleanup_hook_t* memo = NULL;
  veil_cleanup_hook_t* hook = curr_env->cleanup_hook;

  while (hook != NULL) {
    if (fun == hook->fn) {
      NAPI_WEAK_ASSERT(napi_invalid_arg, arg != hook->arg);
    }
    memo = hook;
    hook = hook->next;
  }

  veil_cleanup_hook_t* new_hook = IOTJS_ALLOC(veil_cleanup_hook_t);
  new_hook->fn = fun;
  new_hook->arg = arg;
  new_hook->next = NULL;

  if (memo == NULL) {
    curr_env->cleanup_hook = new_hook;
  } else {
    memo->next = new_hook;
  }

  NAPI_RETURN(napi_ok);
}

napi_status napi_remove_env_cleanup_hook(napi_env env, void (*fun)(void* arg),
                                         void* arg) {
  NAPI_TRY_ENV(env);
  veil_napi_env_t* curr_env = (veil_napi_env_t*)env;
  veil_cleanup_hook_t* memo = NULL;
  veil_cleanup_hook_t* hook = curr_env->cleanup_hook;
  bool found = false;
  while (hook != NULL) {
    if (fun == hook->fn && arg == hook->arg) {
      found = true;
      break;
    }
    memo = hook;
    hook = hook->next;
  }

  NAPI_WEAK_ASSERT(napi_invalid_arg, found);
  if (memo == NULL) {
    curr_env->cleanup_hook = hook->next;
  } else {
    memo->next = hook->next;
  }
  IOTJS_RELEASE(hook);
  NAPI_RETURN(napi_ok);
}

void veil_setup_napi() {
  veil_napi_env_t* env = (veil_napi_env_t*)veil_get_current_napi_env();
  env->main_thread = uv_thread_self();
}

void veil_cleanup_napi() {
  veil_napi_env_t* env = (veil_napi_env_t*)veil_get_current_napi_env();
  veil_cleanup_hook_t* hook = env->cleanup_hook;
  while (hook != NULL) {
    hook->fn(hook->arg);
    veil_cleanup_hook_t* memo = hook;
    hook = hook->next;
    IOTJS_RELEASE(memo);
  }
}
