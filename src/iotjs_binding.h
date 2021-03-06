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

#ifndef IOTJS_BINDING_H
#define IOTJS_BINDING_H

#include "iotjs_util.h"
#include "jerryscript.h"

#include <stdio.h>
#include <stc/forward.h>

typedef const jerry_object_native_info_t JNativeInfoType;

/* Constructors */
jerry_value_t iotjs_jval_create_string(const cstr* v);
jerry_value_t iotjs_jval_create_byte_array(uint32_t len, const char* data);
jerry_value_t iotjs_jval_create_function(jerry_external_handler_t handler);
jerry_value_t iotjs_jval_create_error_without_error_flag(const char* msg);

/* Type Converters */
bool iotjs_jval_as_boolean(jerry_value_t);
double iotjs_jval_as_number(jerry_value_t);
cstr iotjs_jval_as_string(jerry_value_t);
jerry_value_t iotjs_jval_as_object(jerry_value_t);
jerry_value_t iotjs_jval_as_array(jerry_value_t);
jerry_value_t iotjs_jval_as_function(jerry_value_t);
bool iotjs_jbuffer_as_string(jerry_value_t jval, cstr* out_string);

/* Methods for General JavaScript Object */
void iotjs_jval_set_method(jerry_value_t jobj, const char* name,
                           jerry_external_handler_t handler);
bool iotjs_jval_set_prototype(jerry_value_t jobj, jerry_value_t jproto);
void iotjs_jval_set_property_jval(jerry_value_t jobj, const char* name,
                                  jerry_value_t value);
void iotjs_jval_set_property_boolean(jerry_value_t jobj, const char* name,
                                     bool v);
void iotjs_jval_set_property_number(jerry_value_t jobj, const char* name,
                                    double v);
void iotjs_jval_set_property_string(jerry_value_t jobj, const char* name,
                                    const cstr* v);
void iotjs_jval_set_property_string_raw(jerry_value_t jobj, const char* name,
                                        const char* v);
void iotjs_jval_set_getter(jerry_value_t obj, const char* name, jerry_external_handler_t getter);
bool iotjs_jval_has_property(jerry_value_t jobj, const char* name);

jerry_value_t iotjs_jval_get_property(jerry_value_t jobj, const char* name);

void iotjs_jval_set_property_by_index(jerry_value_t jarr, uint32_t idx,
                                      jerry_value_t jval);
jerry_value_t iotjs_jval_get_property_by_index(jerry_value_t jarr,
                                               uint32_t idx);
cstr iotjs_jval_get_property_as_string(jerry_value_t jobj, const char* name);
int32_t iotjs_jval_get_property_as_int32(jerry_value_t jobj, const char* name, int32_t fallback);
bool iotjs_jval_get_property_as_bool(jerry_value_t jobj, const char* name);

/* Note:
 *      Defines started with underscores should not be used
 *      outside of this header.
 */
#define JS_CREATE_ERROR(TYPE, message) \
  jerry_error_sz(JERRY_ERROR_##TYPE, message)

#define jerry_value_is_any(value) true
#define iotjs_jval_as_any(value) (value)

#define JS_CHECK(predicate)                           \
  if (!(predicate)) {                                 \
    return JS_CREATE_ERROR(COMMON, "Internal error"); \
  }

#define __JS_CHECK_TYPE(index, type) jerry_value_is_##type(jargv[index])

#define JS_CHECK_ARG(index, type) JS_CHECK(__JS_CHECK_TYPE(index, type))

#define JS_CHECK_ARG_IF_EXIST(index, type) \
  if (jargc > (index)) {                   \
    JS_CHECK(__JS_CHECK_TYPE(index, type)) \
  }

#define JS_CHECK_ARGS_0()

#define JS_CHECK_ARGS_1(type0) \
  JS_CHECK_ARGS_0()            \
  __JS_CHECK_TYPE(0, type0)

#define JS_CHECK_ARGS_2(type0, type1) \
  JS_CHECK_ARGS_1(type0)              \
  &&__JS_CHECK_TYPE(1, type1)

#define JS_CHECK_ARGS_3(type0, type1, type2) \
  JS_CHECK_ARGS_2(type0, type1)              \
  &&__JS_CHECK_TYPE(2, type2)

#define JS_CHECK_ARGS_4(type0, type1, type2, type3) \
  JS_CHECK_ARGS_3(type0, type1, type2)              \
  &&__JS_CHECK_TYPE(3, type3)

#define JS_CHECK_ARGS_5(type0, type1, type2, type3, type4) \
  JS_CHECK_ARGS_4(type0, type1, type2, type3)              \
  &&__JS_CHECK_TYPE(4, type4)

#define JS_CHECK_ARGS_6(type0, type1, type2, type3, type4, type5) \
  JS_CHECK_ARGS_5(type0, type1, type2, type3, type4)              \
  &&__JS_CHECK_TYPE(5, type5)

#define JS_CHECK_ARGS(argc, ...) \
  JS_CHECK(jargc >= argc && JS_CHECK_ARGS_##argc(__VA_ARGS__))

#define JS_CHECK_THIS() JS_CHECK(jerry_value_is_object(call_info_p->this_value))

#define JS_GET_ARG(index, type) iotjs_jval_as_##type(jargv[index])

#define JS_GET_ARG_IF_EXIST(index, type)                  \
  ((jargc > (index)) && jerry_value_is_##type(jargv[index]) \
       ? jargv[index]                                     \
       : jerry_null())

#define JS_GET_THIS() iotjs_jval_as_object(call_info_p->this_value)

#define JS_FUNCTION(name)                                \
  static jerry_value_t name(const jerry_call_info_t *call_info_p,   \
                            const jerry_value_t jargv[], \
                            const jerry_length_t jargc)

#if !defined(DEBUG)
// This code branch is to be in #ifdef NDEBUG
#define DJS_CHECK(predicate) ((void)0)
#define DJS_CHECK_ARG(index, type) ((void)0)
#define DJS_CHECK_ARGS(argc, ...) ((void)0)
#define DJS_CHECK_THIS() ((void)0)
#define DJS_CHECK_ARG_IF_EXIST(index, type) ((void)0)
#else
#define DJS_CHECK(predicate) JS_CHECK(predicate)
#define DJS_CHECK_ARG(index, type) JS_CHECK_ARG(index, type)
#define DJS_CHECK_ARGS(argc, ...) JS_CHECK_ARGS(argc, __VA_ARGS__)
#define DJS_CHECK_THIS() JS_CHECK_THIS()
#define DJS_CHECK_ARG_IF_EXIST(index, type) JS_CHECK_ARG_IF_EXIST(index, type)
#endif

#define JS_DECLARE_PTR(JOBJ, TYPE, NAME)                              \
  TYPE* NAME;                                                         \
  do {                                                                \
    if (!((NAME) = jerry_object_get_native_ptr(JOBJ, &this_module_native_info))) { \
      return JS_CREATE_ERROR(COMMON, "Internal");                     \
    }                                                                 \
  } while (0)

#define JS_DECLARE_THIS_PTR(type, name) \
  JS_DECLARE_PTR(call_info_p->this_value, iotjs_##type##_t, name)

#define JS_DECLARE_OBJECT_PTR(index, type, name) \
  JS_DECLARE_PTR(jargv[index], iotjs_##type##_t, name)

#define JS_GET_REQUIRED_ARG_VALUE(index, target, property, type)            \
  do {                                                                      \
    if (jerry_value_is_undefined(jargv[index])) {                           \
      return JS_CREATE_ERROR(TYPE, "Missing argument, required " property); \
    } else if (jerry_value_is_##type(jargv[index])) {                       \
      target = iotjs_jval_as_##type(jargv[index]);                          \
    } else {                                                                \
      return JS_CREATE_ERROR(TYPE, "Bad arguments, required " property      \
                                   " is not a " #type);                     \
    }                                                                       \
  } while (0)

#define JS_GET_REQUIRED_CONF_VALUE(src, target, property, type)             \
  do {                                                                      \
    jerry_value_t value = iotjs_jval_get_property(src, property);           \
    if (jerry_value_is_undefined(value)) {                                  \
      jerry_release_value(value);                                           \
      return JS_CREATE_ERROR(TYPE, "Missing argument, required " property); \
    } else if (jerry_value_is_##type(value)) {                              \
      target = iotjs_jval_as_##type(value);                                 \
      jerry_release_value(value);                                           \
    } else {                                                                \
      jerry_release_value(value);                                           \
      return JS_CREATE_ERROR(TYPE, "Bad arguments, required " property      \
                                   " is not a " #type);                     \
    }                                                                       \
  } while (0)

jerry_value_t vm_exec_stop_callback(void* user_p);

#endif /* IOTJS_BINDING_H */
