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


#ifndef IOTJS_DEF_H
#define IOTJS_DEF_H


#ifndef IOTJS_MAX_READ_BUFFER_SIZE
#if defined(__NUTTX__) || defined(__TIZENRT__)
#define IOTJS_MAX_READ_BUFFER_SIZE 1023
#define IOTJS_MAX_PATH_SIZE 120
#else /* !__NUTTX__ && !__TIZENRT__ */
#define IOTJS_MAX_READ_BUFFER_SIZE 65535
#define IOTJS_MAX_PATH_SIZE PATH_MAX
#endif /* __NUTTX__ || TIZENRT */
#endif /* IOTJS_MAX_READ_BUFFER_SIZE */


#ifndef IOTJS_ASSERT
#ifdef NDEBUG
#define IOTJS_ASSERT(x) ((void)(x))
#else /* !NDEBUG */
#define IOTJS_ASSERT(x)                                                      \
  do {                                                                       \
    if (!(x)) {                                                              \
      fprintf(stderr, "%s:%d: Assertion '%s' failed.\n", __FILE__, __LINE__, \
              #x);                                                           \
      print_stacktrace();                                                    \
      force_terminate();                                                     \
    }                                                                        \
  } while (0)
#endif /* NDEBUG */
#endif /* IOTJS_ASSERT */

#if defined(__arm__)
#define TARGET_ARCH "arm"
#elif defined(__i686__)
#define TARGET_ARCH "ia32"
#elif defined(__x86_64__)
#define TARGET_ARCH "x64"
#else /* !__arm__ && !__i686__ && !__x86_64__ */
#define TARGET_ARCH "unknown"
#endif /* __arm__ */


#if defined(__linux__)
#if defined(__TIZEN__)
#define TARGET_OS "tizen"
#else
#define TARGET_OS "linux"
#endif /* __TIZEN__ */
#elif defined(__NUTTX__)
#define TARGET_OS "nuttx"
#elif defined(__APPLE__)
#define TARGET_OS "darwin"
#elif defined(__TIZENRT__)
#define TARGET_OS "tizenrt"
#elif defined(WIN32)
#define TARGET_OS "win32"
#else /* !__linux__ && !__NUTTX__ !__APPLE__ && !__TIZENRT__ && !WIN32 */
#define TARGET_OS "unknown"
#endif /* __linux__ */

#if !defined(STRINGIFY)
#define STRINGIFY(x) #x
#endif /* STRINGIFY */

#if !defined(TOSTRING)
#define TOSTRING(x) STRINGIFY(x)
#endif /* TOSTRING */

#define VEIL_VERSION_STRING (TOSTRING(VEIL_VERSION_MAJOR) "." TOSTRING(VEIL_VERSION_MINOR) "." TOSTRING(VEIL_VERSION_PATCH))

#if !defined(TARGET_BOARD)
#define TARGET_BOARD "unknown"
#endif /* TARGET_BOARD */

#define NODE_MAJOR_VERSION VEIL_VERSION_MAJOR
#define NODE_MINOR_VERSION VEIL_VERSION_MINOR
#define NODE_PATCH_VERSION VEIL_VERSION_PATCH

/* Avoid compiler warnings if needed. */
#define IOTJS_UNUSED(x) ((void)(x))

#define IOTJS_DEFINE_NATIVE_HANDLE_INFO_THIS_MODULE(name)                  \
  static void iotjs_##name##_destroy(void *native_p, struct jerry_object_native_info_t *info_p);              \
  static const jerry_object_native_info_t this_module_native_info = {      \
    .free_cb = (jerry_object_native_free_cb_t)iotjs_##name##_destroy \
  }

#define VEIL_DEFINE_NATIVE_HANDLE_INFO_THIS_MODULE(name)                  \
  static void veil_##name##_destroy(void *native_p, struct jerry_object_native_info_t *info_p);              \
  static const jerry_object_native_info_t this_module_native_info = {      \
    .free_cb = (jerry_object_native_free_cb_t)veil_##name##_destroy \
  }

#include <uv.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>

// commonly used header files
#include "iotjs_binding.h"
#include "iotjs_binding_helper.h"
#include "iotjs_debuglog.h"
#include "veil_env.h"
#include "iotjs_magic_strings.h"
#include "iotjs_module.h"
#include "iotjs_util.h"
#include "veil_string.h"
#include <stc/cstr.h>

#if defined(__linux__)
#include <linux/limits.h>
#define PATH_MAX_BYTES PATH_MAX
#elif defined(__APPLE__)
#include <sys/syslimits.h>
#define PATH_MAX_BYTES PATH_MAX
#elif defined(WIN32)
/* MAX_PATH is in characters, not bytes. Make sure we have enough headroom. */
#define PATH_MAX_BYTES (MAX_PATH * 4)
#endif

#define VEIL_DEFINE_CONSTANT(target, name) \
  iotjs_jval_set_property_number(target, #name, name)

#endif /* IOTJS_DEF_H */
