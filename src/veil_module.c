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

#include "veil_module.h"

#include "iotjs_def.h"
#include "iotjs_js.h"
#include "iotjs_binding_helper.h"
#include <stdlib.h>

#define SET_CONSTANT(object, constant)                           \
  do {                                                           \
    iotjs_jval_set_property_number(object, #constant, constant); \
  } while (0)

typedef enum format_type_t {
  FORMAT_MODULE = 1,
  FORMAT_COMMONJS = 2,
  FORMAT_BUILTIN = 3,
  FORMAT_JSON = 4,
  FORMAT_ADDON = 5,
} format_type_t;

static bool s_was_initialized = false;
static jerry_value_t s_module = 0;
static jerry_value_t s_event_listener_import = 0;
static jerry_value_t s_event_listener_destroy = 0;
static veil_module_on_ready_handler_t s_on_ready_handler = NULL;

// helper functions
static jerry_value_t native_module_evaluate(jerry_value_t module_record);
static jerry_value_t get_builtins();
static void add_enums(jerry_value_t object);
static const iotjs_js_module_t* get_builtin_by_id(const char* id);
static jerry_value_t string_format(const char* fmt, const char* replace);
static void set_module_meta(jerry_value_t meta_object);
static void set_builtin_meta(jerry_value_t meta_object, const iotjs_js_module_t* builtin);
static jerry_value_t run_cjs(jerry_value_t source, const jerry_value_t* argv, size_t argc);
// jerryscript callbacks
static jerry_value_t on_import (jerry_value_t specifier, jerry_value_t user_value, void *user_p);
static void on_import_meta(jerry_value_t module, jerry_value_t meta_object, void *user_p);
static jerry_value_t js_resolve (jerry_value_t specifier, jerry_value_t referrer, void *user_p);

JS_FUNCTION(js_from_symbols) {
  DJS_CHECK_ARGS(2, string, array);

  jerry_value_t exports = jargv[1];
  jerry_length_t length = jerry_array_length(exports);
  jerry_value_t module;
  jerry_value_t* symbols = malloc(length * sizeof(jerry_value_t));
  bool linked = false;

  for (jerry_length_t i = 0; i < length; i++) {
    symbols[i] = jerry_object_get_index(exports, i);
  }

  module = jerry_native_module(&native_module_evaluate, symbols, length);

  if (jerry_value_is_exception(module)) {
    linked = false;
  } else if (jerry_module_state(module) == JERRY_MODULE_STATE_LINKED) {
    linked = true;
  } else if (jerry_module_state(module) == JERRY_MODULE_STATE_UNLINKED) {
    jerry_value_t link_result = jerry_module_link(module, js_resolve, NULL);

    if (!jerry_value_is_boolean(link_result)) {
      linked = false;
    } else {
      linked = jerry_value_to_boolean(link_result);
    }

    jerry_value_free(link_result);
  }

  for (jerry_length_t i = 0; i < length; i++) {
    jerry_value_free(symbols[i]);
  }

  free(symbols);

  if (linked) {
    iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_ID, jargv[0]);
    iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_FILENAME, jargv[0]);
    iotjs_jval_set_property_number(module, IOTJS_MAGIC_STRING_FORMAT, FORMAT_COMMONJS);
  } else if (!jerry_value_is_exception(module)) {
    jerry_value_free(module);
    module = jerry_throw_sz(JERRY_ERROR_COMMON, "failed to link modules with provided symbols");
  }

  return module;
}

JS_FUNCTION(js_from_builtin) {
  DJS_CHECK_ARGS(1, string);
  iotjs_string_t id = JS_GET_ARG(0, string);
  const iotjs_js_module_t* builtin = get_builtin_by_id(iotjs_string_data(&id));
  jerry_value_t module;
  jerry_value_t filename = string_format("%s.mjs", iotjs_string_data(&id));

  if (builtin) {
    jerry_parse_options_t opts = {
      .options = JERRY_PARSE_MODULE | JERRY_PARSE_HAS_SOURCE_NAME,
      .source_name = filename,
    };

    module = jerry_parse(builtin->code, builtin->length, &opts);
  } else {
    IOTJS_ASSERT(false && "cannot find builtin module");
    module = jerry_throw_sz(JERRY_ERROR_COMMON, "cannot find builtin module");
  }

  if (!jerry_value_is_exception(module)) {
    iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_ID, jargv[0]);
    iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_FILENAME, filename);
    iotjs_jval_set_property_number(module, IOTJS_MAGIC_STRING_FORMAT, FORMAT_BUILTIN);
  }

  jerry_value_free(filename);
  iotjs_string_destroy(&id);

  return module;
}

JS_FUNCTION(js_from_file) {
  DJS_CHECK_ARGS(1, string);

  jerry_value_t id = jargv[0];
  iotjs_string_t filename = JS_GET_ARG(0, string);
  iotjs_string_t source = iotjs_file_read(iotjs_string_data(&filename));
  jerry_value_t module;

  if (source.size == 0) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "file not found");
  } else {
    // on_import (dynamic import) receives the user_value. this will be the way that on_import
    // will look up the parent module path to resolve the import request. the preference would
    // be to use the module as the user_value, but that is created with jerry_parse. the id/filename
    // will work.
    jerry_parse_options_t opts = {
      .options = JERRY_PARSE_MODULE | JERRY_PARSE_HAS_USER_VALUE | JERRY_PARSE_HAS_SOURCE_NAME,
      .user_value = id,
      .source_name = id,
    };

    module = jerry_parse(
        (const jerry_char_t*)iotjs_string_data(&source),
        source.size,
        &opts);

    if (!jerry_value_is_exception(module)) {
      iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_ID, id);
      iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_FILENAME, id);
      iotjs_jval_set_property_number(module, IOTJS_MAGIC_STRING_FORMAT, FORMAT_MODULE);
    }
  }

  iotjs_string_destroy(&filename);
  iotjs_string_destroy(&source);

  return module;
}

JS_FUNCTION(js_register_callback) {
  DJS_CHECK_ARGS(2, string, function);
  iotjs_string_t event = JS_GET_ARG(0, string);
  bool unknown = false;

  if (strcmp(iotjs_string_data(&event), IOTJS_MAGIC_STRING_IMPORT) == 0) {
    s_event_listener_import = jerry_value_copy(jargv[1]);
  } else if (strcmp(iotjs_string_data(&event), IOTJS_MAGIC_STRING_DESTROY) == 0) {
    s_event_listener_destroy = jerry_value_copy(jargv[1]);
  } else {
    IOTJS_ASSERT(false && "Unknown module event name");
    unknown = true;
  }

  iotjs_string_destroy(&event);

  if (unknown) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "Unknown module event name");
  }

  return jerry_undefined();
}

JS_FUNCTION(js_run_cjs) {
  DJS_CHECK_ARGS(6, string, string, string, function, object, object);

  return run_cjs(jargv[0], &jargv[1], jargc);
}

JS_FUNCTION(js_read_file_sync) {
  DJS_CHECK_ARGS(2, string, boolean);
  iotjs_string_t filename = JS_GET_ARG(0, string);
  bool strip_bom = JS_GET_ARG(1, boolean);
  iotjs_string_t source = iotjs_file_read(iotjs_string_data(&filename));
  jerry_value_t contents;

  if (source.size == 0) {
    contents = jerry_throw_sz(JERRY_ERROR_COMMON, "Error reading file.");
  } else {
    uint8_t* bytes = (uint8_t*)iotjs_string_data(&source);

    if (strip_bom && source.size > 3 && bytes[0] == 0xef && bytes[1] == 0xbb && bytes[2] == 0xbf) {
      contents = jerry_string(bytes + 3, source.size - 3, JERRY_ENCODING_UTF8);
    } else {
      contents = jerry_string_sz(iotjs_string_data(&source));
    }
  }

  iotjs_string_destroy(&filename);
  iotjs_string_destroy(&source);

  return contents;
}

JS_FUNCTION(js_module_namespace) {
  DJS_CHECK_ARGS(1, object);

  return jerry_module_namespace(jargv[0]);
}

JS_FUNCTION(js_module_state) {
  DJS_CHECK_ARGS(1, object);
  return jerry_number(jerry_module_state(jargv[0]));
}

JS_FUNCTION(js_module_link) {
  DJS_CHECK_ARGS(2, object, function);

  jerry_module_state_t state = jerry_module_state(jargv[0]);

  if (state == JERRY_MODULE_STATE_LINKED || state == JERRY_MODULE_STATE_EVALUATED) {
    return jerry_boolean(true);
  }

  return jerry_module_link(jargv[0], &js_resolve, (void*)(uintptr_t)jargv[1]);
}

JS_FUNCTION(js_module_evaluate) {
  DJS_CHECK_ARGS(1, object);

  switch (jerry_module_state(jargv[0])) {
    case JERRY_MODULE_STATE_EVALUATED:
      return jerry_undefined();
    case JERRY_MODULE_STATE_LINKED:
      return jerry_module_evaluate(jargv[0]);
    default:
      return jerry_throw_sz(JERRY_ERROR_COMMON, "evaluate: invalid state");
  }
}

JS_FUNCTION(js_module_evaluate_with) {
  DJS_CHECK_ARGS(2, object, object);

  if (jerry_module_state(jargv[0]) != JERRY_MODULE_STATE_LINKED) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "evaluate: invalid state");
  }

  jerry_value_t module = jargv[0];
  jerry_value_t resolved = jargv[1];
  jerry_value_t keys = jerry_object_keys(resolved);

  if (jerry_value_is_array(keys)) {
    jerry_length_t length = jerry_array_length(keys);
    jerry_value_t key;
    jerry_value_t value;
    jerry_value_t set;

    for (jerry_length_t i = 0; i < length; i++) {
      key = jerry_object_get_index(keys, i);

      if (jerry_value_is_string(key)) {
        value = jerry_object_get(resolved, key);

        if (!jerry_value_is_exception(value)) {
          set = jerry_native_module_set(module, key, value);
          jerry_value_free(set);
        }

        jerry_value_free(value);
      }

      jerry_value_free(key);
    }
  }

  jerry_value_free(keys);

  return jerry_undefined();
}

JS_FUNCTION(js_emit_ready) {
  IOTJS_ASSERT(s_on_ready_handler != NULL);

  if (s_on_ready_handler) {
    s_on_ready_handler();
  }

  return jerry_undefined();
}

static const iotjs_js_module_t* get_builtin_by_id(const char* id) {
  const iotjs_js_module_t* builtin = NULL;

  for (size_t i = 0; js_modules[i].name != NULL; i++) {
    if (strcmp(js_modules[i].name, id) == 0) {
      builtin = &js_modules[i];
      break;
    }
  }

  return builtin;
}

// assumes fmt has zero or one %s
static jerry_value_t string_format(const char* fmt, const char* replace) {
  char* buffer = iotjs_buffer_allocate(strlen(fmt) + strlen(replace) + 1);

  sprintf(buffer, fmt, replace);

  jerry_value_t result = jerry_string_sz(buffer);

  iotjs_buffer_release(buffer);

  return result;
}

static jerry_value_t get_builtins() {
  size_t i = 0;
  size_t length;
  jerry_value_t result;

  while (js_modules[i++].name) {}

  result = jerry_array(length = i - 1);

  for (i = 0; i < length; i++) {
    jerry_value_t name = jerry_string_sz(js_modules[i].name);

    iotjs_jval_set_property_by_index(result, i, name);
    jerry_value_free(name);
  }

  return result;
}

static void add_enums(jerry_value_t object) {
  // format constants
  SET_CONSTANT(object, FORMAT_MODULE);
  SET_CONSTANT(object, FORMAT_COMMONJS);
  SET_CONSTANT(object, FORMAT_BUILTIN);
  SET_CONSTANT(object, FORMAT_JSON);
  SET_CONSTANT(object, FORMAT_ADDON);

  // module state constants
  iotjs_jval_set_property_number(object, "STATE_INVALID", JERRY_MODULE_STATE_INVALID);
  iotjs_jval_set_property_number(object, "STATE_UNLINKED", JERRY_MODULE_STATE_UNLINKED);
  iotjs_jval_set_property_number(object, "STATE_LINKING", JERRY_MODULE_STATE_LINKING);
  iotjs_jval_set_property_number(object, "STATE_LINKED", JERRY_MODULE_STATE_LINKED);
  iotjs_jval_set_property_number(object, "STATE_EVALUATING", JERRY_MODULE_STATE_EVALUATING);
  iotjs_jval_set_property_number(object, "STATE_EVALUATED", JERRY_MODULE_STATE_EVALUATED);
  iotjs_jval_set_property_number(object, "STATE_ERROR", JERRY_MODULE_STATE_ERROR);
}

// called when import.meta is found in a script for the first time
// note: the ECMA ModuleRecord is passed in NOT a Module class instance. js forwards
//       the onImportMeta call to the associated Module instance.
static void on_import_meta(jerry_value_t module, jerry_value_t meta_object, void *user_p) {
  iotjs_string_t id = iotjs_jval_get_property_as_string(module, IOTJS_MAGIC_STRING_ID);

  if (strcmp(iotjs_string_data(&id), "module") == 0) {
    set_module_meta(meta_object);
  } else {
    const iotjs_js_module_t* builtin = get_builtin_by_id(iotjs_string_data(&id));

    if (builtin != NULL) {
      set_builtin_meta(meta_object, builtin);
    }
  }

  jerry_value_t url = iotjs_jval_get_property(module, IOTJS_MAGIC_STRING_URL);

  iotjs_jval_set_property_jval(meta_object, IOTJS_MAGIC_STRING_URL, url);
  jerry_value_free(url);

  iotjs_string_destroy(&id);
}

// Fills in import.meta.native for the first boot script that sets up the JS environments
static void set_module_meta(jerry_value_t meta_object) {
  jerry_value_t native = jerry_object();

  // import.meta.native.getNamespace()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_GET_NAMESPACE, js_module_namespace);

  // import.meta.native.getState()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_GET_STATE, js_module_state);

  // import.meta.native.link()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_LINK, js_module_link);

  // import.meta.evaluate()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_EVALUATE, js_module_evaluate);

  // import.meta.evaluateWith()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_EVALUATE_WITH, js_module_evaluate_with);

  // import.native.emitReady()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_EMIT_READY, js_emit_ready);

  // import.native.fromSymbols()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_FROM_SYMBOLS, js_from_symbols);

  // import.native.fromBuiltin()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_FROM_BUILTIN, js_from_builtin);

  // import.native.fromFile()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_FROM_FILE, js_from_file);

  // import.native.on()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_ON, js_register_callback);

  // import.native.readFileSync()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_READ_FILE_SYNC, js_read_file_sync);

  // import.native.cjs()
  iotjs_jval_set_method(native, IOTJS_MAGIC_STRING_CJS, js_run_cjs);

  // import.native.builtins
  jerry_value_t builtins = get_builtins();
  iotjs_jval_set_property_jval(native, IOTJS_MAGIC_STRING_BUILTINS, builtins);
  jerry_value_free(builtins);

  // import.native.STATE_*; import.native.MODULE_*
  add_enums(native);

  // import.meta.native
  iotjs_jval_set_property_jval(meta_object, IOTJS_MAGIC_STRING_NATIVE, native);
  jerry_value_free(native);
}

static void set_builtin_meta(jerry_value_t meta_object, const iotjs_js_module_t* builtin) {
  jerry_value_t native = iotjs_module_get_copy(builtin->name);

  // import.meta.native
  iotjs_jval_set_property_jval(meta_object, IOTJS_MAGIC_STRING_NATIVE, native);
  jerry_value_free(native);
}

// called when a dynamic import is encountered during script evaluation
// note: user_value is passed to parse
static jerry_value_t on_import (jerry_value_t specifier, jerry_value_t user_value, void *user_p) {
  bool on_import_callback_available = s_was_initialized && jerry_value_is_function(s_event_listener_import);
  IOTJS_ASSERT(on_import_callback_available);

  if (!on_import_callback_available) {
    return jerry_throw_sz(JERRY_ERROR_COMMON, "no import handler installed");
  }

  const jerry_value_t argv[] = {
    specifier,
    user_value
  };

  jerry_value_t result = jerry_call(
      s_event_listener_import,
      jerry_undefined(),
      argv,
      sizeof(argv) / sizeof(jerry_value_t));

  if (jerry_value_is_exception(result)) {
    iotjs_uncaught_exception(result);
  }

  return result;
}

static jerry_value_t native_module_evaluate(jerry_value_t module_record) {
  jerry_value_t resolved = iotjs_jval_get_property(module_record, IOTJS_MAGIC_STRING_RESOLVED);
  jerry_value_t keys = jerry_object_keys(resolved);

  if (jerry_value_is_array(keys)) {
    jerry_length_t length = jerry_array_length(keys);
    jerry_value_t key;
    jerry_value_t value;
    jerry_value_t set;

    for (jerry_length_t i = 0; i < length; i++) {
      key = jerry_object_get_index(keys, i);

      if (jerry_value_is_string(key)) {
        value = jerry_object_get(resolved, key);

        if (!jerry_value_is_exception(value)) {
          set = jerry_native_module_set(module_record, key, value);
          jerry_value_free(set);
        }

        jerry_value_free(value);
      }

      jerry_value_free(key);
    }
  }

  jerry_value_free(resolved);
  jerry_value_free(keys);

  return jerry_undefined();
}

static jerry_value_t js_resolve (jerry_value_t specifier, jerry_value_t referrer, void *user_p) {
  jerry_value_t callback = (jerry_value_t)(uintptr_t)user_p;
  jerry_value_t args [] = {
    specifier,
    referrer
  };

  return jerry_call(
      callback,
      jerry_undefined(),
      args,
      sizeof(args) / sizeof(jerry_value_t));
}

static jerry_value_t run_cjs(jerry_value_t source, const jerry_value_t* argv, size_t argc) {
  jerry_value_t parsed;
  jerry_parse_options_t opts = {
    .options = JERRY_PARSE_HAS_SOURCE_NAME | JERRY_PARSE_HAS_ARGUMENT_LIST,
    .source_name = jerry_value_copy(argv[0]),
    .argument_list = jerry_string_sz("__filename, __dirname, require, module, exports"),
  };

  if (jerry_value_is_string(source)) {
    parsed = jerry_parse_value(source, &opts);
  } else {
    iotjs_string_t fn = iotjs_jval_as_string(argv[0]);
    iotjs_string_t s = iotjs_file_read(iotjs_string_data(&fn));

    parsed = jerry_parse((const jerry_char_t*)iotjs_string_data(&s), s.size, &opts);

    iotjs_string_destroy(&fn);
    iotjs_string_destroy(&s);
  }

  jerry_value_t result;

  if (!jerry_value_is_exception(parsed)) {
    result = jerry_call(parsed, jerry_undefined(), argv, argc);
  } else {
    result = jerry_value_copy(parsed);
  }

  jerry_value_free(opts.source_name);
  jerry_value_free(opts.argument_list);
  jerry_value_free(parsed);

  return result;
}

jerry_value_t veil_module_run(veil_module_on_ready_handler_t on_ready) {
  jerry_value_t module;
  jerry_value_t filename = string_format("%s.mjs", module_n);

  jerry_parse_options_t opts = {
    .options = JERRY_PARSE_MODULE | JERRY_PARSE_HAS_SOURCE_NAME,
    .source_name = filename,
  };

  module = jerry_parse(module_s, module_l, &opts);

  if (jerry_value_is_exception(module)) {
    jerry_value_free(filename);
    return module;
  }

  jerry_value_t id = jerry_string_sz(module_n);

  iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_ID, id);
  iotjs_jval_set_property_jval(module, IOTJS_MAGIC_STRING_FILENAME, filename);
  iotjs_jval_set_property_number(module, IOTJS_MAGIC_STRING_FORMAT, FORMAT_MODULE);

  s_module = jerry_value_copy(module);
  s_event_listener_destroy = jerry_undefined();
  s_event_listener_import = jerry_undefined();
  s_on_ready_handler = on_ready;
  s_was_initialized = true;

  jerry_module_on_import(&on_import, NULL);
  jerry_module_on_import_meta(&on_import_meta, NULL);

  jerry_value_t evaluate_result;
  jerry_value_t link_result = jerry_module_link(module, NULL, NULL);

  if (jerry_value_is_boolean(link_result) && jerry_value_is_true(link_result)) {
    evaluate_result = jerry_module_evaluate(module);
  } else if (jerry_value_is_exception(link_result)){
    evaluate_result = link_result;
  } else {
    jerry_value_free(link_result);
    link_result = jerry_undefined();
    evaluate_result = jerry_throw_sz(JERRY_ERROR_COMMON, "failed to link JS entry point script");
  }

  if (jerry_value_is_exception(evaluate_result)) {
    jerry_value_free(s_module);
    s_module = jerry_undefined();
  }

  jerry_value_free(id);
  jerry_value_free(filename);
  jerry_value_free(link_result);
  jerry_value_free(module);

  return evaluate_result;
}

void veil_module_cleanup() {
  if (s_was_initialized) {
    jerry_value_free(s_module);
    jerry_value_free(s_event_listener_import);
    jerry_value_free(s_event_listener_destroy);
    s_on_ready_handler = NULL;
    s_was_initialized = false;
  }
}
