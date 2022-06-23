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
#include "iotjs_binding.h"
#include "iotjs_js.h"
#include "modules/iotjs_module_buffer.h"

#include <string.h>

jerry_value_t iotjs_jval_create_string(const cstr* v) {
  jerry_value_t jval;

  const jerry_char_t* data = (const jerry_char_t*)(cstr_str_safe(v));
  jerry_size_t size = (jerry_size_t)cstr_size(*v);

  if (jerry_validate_string(data, size, JERRY_ENCODING_UTF8)) {
    jval = jerry_string(data, size, JERRY_ENCODING_UTF8);
  } else {
    jval = JS_CREATE_ERROR(TYPE, "Invalid UTF-8 string");
  }

  return jval;
}


jerry_value_t iotjs_jval_create_byte_array(uint32_t len, const char* data) {
  if (data == NULL) {
    len = 0;
  }

  jerry_value_t jval = jerry_array(len);

  for (uint32_t i = 0; i < len; i++) {
    jerry_value_t val = jerry_number((double)data[i]);
    jerry_value_t res = jerry_object_set_index(jval, i, val);
    jerry_value_free(res);
    jerry_value_free(val);
  }

  return jval;
}


jerry_value_t iotjs_jval_create_function(jerry_external_handler_t handler) {
  jerry_value_t jval = jerry_function_external(handler);

  IOTJS_ASSERT(jerry_value_is_constructor(jval));

  return jval;
}


jerry_value_t iotjs_jval_create_error_without_error_flag(const char* msg) {
  jerry_value_t jval = jerry_error_sz(JERRY_ERROR_COMMON, msg);
  return jerry_exception_value(jval, true);
}


bool iotjs_jval_as_boolean(jerry_value_t jval) {
  IOTJS_ASSERT(jerry_value_is_boolean(jval));
  return jerry_value_to_boolean(jval);
}


double iotjs_jval_as_number(jerry_value_t jval) {
  IOTJS_ASSERT(jerry_value_is_number(jval));
  return jerry_value_as_number(jval);
}


bool iotjs_jbuffer_as_string(jerry_value_t jval, cstr* out_string) {
  if (out_string == NULL) {
    return false;
  }

  if (jerry_value_is_string(jval)) {
    jerry_size_t size = jerry_string_size(jval, JERRY_ENCODING_UTF8);

    if (size == 0) {
      return false;
    }

    cstr_drop(out_string);
    *out_string = cstr_with_size(size, 0);

    char* buffer = cstr_data(out_string);
    size_t check =
        jerry_string_to_buffer(jval, JERRY_ENCODING_UTF8, (jerry_char_t*)buffer, size);

    IOTJS_ASSERT(check == size);

    return true;
  }

  iotjs_bufferwrap_t* buffer_wrap = iotjs_jbuffer_get_bufferwrap_ptr(jval);

  if (buffer_wrap == NULL || buffer_wrap->length == 0) {
    return false;
  }

  size_t size = buffer_wrap->length;

  cstr_drop(out_string);
  *out_string = cstr_with_size(size, 0);
  memcpy(cstr_data(out_string), buffer_wrap->buffer, size);

  return true;
}

cstr iotjs_jval_as_string(jerry_value_t jval) {
  IOTJS_ASSERT(jerry_value_is_string(jval));

  jerry_size_t size = jerry_string_size(jval, JERRY_ENCODING_UTF8);
  cstr res = cstr_init();
  jerry_char_t* jerry_buffer;
  size_t check;

  if (size == 0) {
    return res;
  }

  cstr_resize(&res, size, 0);
  jerry_buffer = (jerry_char_t*)cstr_str(&res);
  check = jerry_string_to_buffer(jval, JERRY_ENCODING_UTF8, jerry_buffer, size);

  IOTJS_ASSERT(check == size);

  return res;
}

jerry_value_t iotjs_jval_as_object(jerry_value_t jval) {
  IOTJS_ASSERT(jerry_value_is_object(jval));
  return jval;
}


jerry_value_t iotjs_jval_as_array(jerry_value_t jval) {
  IOTJS_ASSERT(jerry_value_is_array(jval));
  return jval;
}


jerry_value_t iotjs_jval_as_function(jerry_value_t jval) {
  IOTJS_ASSERT(jerry_value_is_function(jval));
  return jval;
}


bool iotjs_jval_set_prototype(jerry_value_t jobj, jerry_value_t jproto) {
  jerry_value_t ret = jerry_object_set_proto(jobj, jproto);
  bool error_found = jerry_value_is_error(ret);
  jerry_value_free(ret);

  return !error_found;
}


void iotjs_jval_set_method(jerry_value_t jobj, const char* name,
                           jerry_external_handler_t handler) {
  IOTJS_ASSERT(jerry_value_is_object(jobj));

  jerry_value_t jfunc = jerry_function_external(handler);
  iotjs_jval_set_property_jval(jobj, name, jfunc);
  jerry_value_free(jfunc);
}


void iotjs_jval_set_property_jval(jerry_value_t jobj, const char* name,
                                  jerry_value_t value) {
  IOTJS_ASSERT(jerry_value_is_object(jobj));

  jerry_value_t prop_name = jerry_string_sz(name);
  jerry_value_t ret_val = jerry_object_set(jobj, prop_name, value);
  jerry_value_free(prop_name);

  IOTJS_ASSERT(!jerry_value_is_error(ret_val));
  jerry_value_free(ret_val);
}

void iotjs_jval_set_property_boolean(jerry_value_t jobj, const char* name,
                                     bool v) {
  iotjs_jval_set_property_jval(jobj, name, jerry_boolean(v));
}

bool iotjs_jval_has_property(jerry_value_t jobj, const char* name) {
  if (!jerry_value_is_object(jobj)) {
    return false;
  }

  bool result;
  jerry_value_t query = jerry_object_has_sz(jobj, name);

  if (jerry_value_is_boolean(query)) {
    result = jerry_value_to_boolean(query);
  } else {
    result = false;
  }

  jerry_value_free(query);

  return result;
}

void iotjs_jval_set_property_number(jerry_value_t jobj, const char* name,
                                    double v) {
  jerry_value_t jval = jerry_number(v);
  iotjs_jval_set_property_jval(jobj, name, jval);
  jerry_value_free(jval);
}


void iotjs_jval_set_property_string(jerry_value_t jobj, const char* name,
                                    const cstr* v) {
  jerry_value_t jval = iotjs_jval_create_string(v);
  iotjs_jval_set_property_jval(jobj, name, jval);
  jerry_value_free(jval);
}


void iotjs_jval_set_property_string_raw(jerry_value_t jobj, const char* name,
                                        const char* v) {
  jerry_value_t jval = jerry_string_sz(v);
  iotjs_jval_set_property_jval(jobj, name, jval);
  jerry_value_free(jval);
}

void iotjs_jval_set_getter(jerry_value_t obj, const char* name, jerry_external_handler_t getter) {
  IOTJS_ASSERT(jerry_value_is_object(obj));

  jerry_property_descriptor_t prop_desc = jerry_property_descriptor();
  jerry_value_t jgetter = jerry_function_external(getter);

  prop_desc.flags = JERRY_PROP_IS_GET_DEFINED | JERRY_PROP_IS_ENUMERABLE_DEFINED | JERRY_PROP_IS_CONFIGURABLE_DEFINED;
  prop_desc.getter = jgetter;

  jerry_value_t property_name = jerry_string_sz(name);
  jerry_value_t prop_ret_val =
      jerry_object_define_own_prop(obj, property_name, &prop_desc);
  jerry_value_free(prop_ret_val);
  jerry_value_free(property_name);
  jerry_property_descriptor_free(&prop_desc);
}

jerry_value_t iotjs_jval_get_property(jerry_value_t jobj, const char* name) {
  IOTJS_ASSERT(jerry_value_is_object(jobj));

  jerry_value_t prop_name = jerry_string_sz(name);
  jerry_value_t res = jerry_object_get(jobj, prop_name);
  jerry_value_free(prop_name);

  if (jerry_value_is_error(res)) {
    jerry_value_free(res);
    return jerry_undefined();
  }

  return res;
}


void iotjs_jval_set_property_by_index(jerry_value_t jarr, uint32_t idx,
                                      jerry_value_t jval) {
  IOTJS_ASSERT(jerry_value_is_object(jarr));

  jerry_value_t ret_val = jerry_object_set_index(jarr, idx, jval);
  IOTJS_ASSERT(!jerry_value_is_error(ret_val));
  jerry_value_free(ret_val);
}


jerry_value_t iotjs_jval_get_property_by_index(jerry_value_t jarr,
                                               uint32_t idx) {
  IOTJS_ASSERT(jerry_value_is_object(jarr));

  jerry_value_t res = jerry_object_get_index(jarr, idx);

  if (jerry_value_is_error(res)) {
    jerry_value_free(res);
    return jerry_undefined();
  }

  return res;
}

cstr iotjs_jval_get_property_as_string(jerry_value_t jobj, const char* name) {
  jerry_value_t value = iotjs_jval_get_property(jobj, name);
  cstr as_string;

  if (jerry_value_is_string(value)) {
    as_string = iotjs_jval_as_string(value);
  } else {
    as_string = cstr_init();
  }

  jerry_value_free(value);

  return as_string;
}

int32_t iotjs_jval_get_property_as_int32(jerry_value_t jobj, const char* name, int32_t fallback) {
  jerry_value_t value = iotjs_jval_get_property(jobj, name);
  int32_t result;

  if (jerry_value_is_number(value)) {
    result = jerry_value_as_int32(value);
  } else {
    result = fallback;
  }

  jerry_value_free(value);

  return result;
}

jerry_value_t vm_exec_stop_callback(void* user_p) {
  State* state_p = (State*)user_p;

  if (*state_p != kExiting) {
    return jerry_undefined();
  }

  return jerry_string_sz("Abort script");
}
