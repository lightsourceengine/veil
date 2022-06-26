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

#include "veil_handle_wrap.h"

#define GET_UV_HANDLE(PROCESS) (uv_handle_t*)&(PROCESS)->handle

#define STATE_INITIALIZED 1
#define STATE_CLOSING 2
#define STATE_CLOSED 3

static void finalize(void *native_p, struct jerry_object_native_info_t *info_p);
static void on_close(uv_handle_t* handle);
static void on_exit(uv_process_t* handle, int64_t exit_status, int term_signal);
static const char* signo_string(int32_t signo);
static char** to_cstring_array(jerry_value_t string_array);
static void free_cstring_array(char** cstring_array);
static void set_stdio_options(jerry_value_t joptions, uv_process_options_t* options);
static const jerry_object_native_info_t this_module_native_info = { &finalize, 0, 0 };

typedef struct veil_process_wrap {
  uv_process_t handle;
  int32_t state;
  jerry_value_t self;
} veil_process_wrap;

veil_process_wrap* veil_process_wrap_new() {
  veil_process_wrap* p = calloc(1, sizeof(veil_process_wrap));

  IOTJS_ASSERT(p != NULL);
  p->self = jerry_undefined();

  return p;
}

int32_t veil_process_wrap_spawn(veil_process_wrap* p, uv_loop_t* loop, jerry_value_t self, uv_process_options_t* options) {
  int32_t err = uv_spawn(loop, &p->handle, options);

  p->self = jerry_value_copy(self);
  p->state = STATE_INITIALIZED;

  return err;
}

int32_t veil_process_wrap_kill(veil_process_wrap* p, int32_t signal) {
  return uv_process_kill(&p->handle, signal);
}

void veil_process_wrap_close(veil_process_wrap* p) {
  if (p->state == STATE_INITIALIZED) {
    uv_close(GET_UV_HANDLE(p), &on_close);
    p->state = STATE_CLOSING;
  }
}

bool veil_process_wrap_has_ref(veil_process_wrap* p) {
  return true; // p->state != STATE_CLOSED && uv_has_ref((uv_handle_t*)&p->handle);
}

void veil_process_wrap_ref(veil_process_wrap* p) {
  if (p->state == STATE_INITIALIZED) {
    uv_ref((uv_handle_t*)&p->handle);
  }
}

void veil_process_wrap_unref(veil_process_wrap* p) {
  if (p->state == STATE_INITIALIZED) {
    uv_unref(GET_UV_HANDLE(p));
  }
}

static void finalize(void* native_p, jerry_object_native_info_t* info_p) {
  veil_process_wrap* p = native_p;

  IOTJS_ASSERT(p->state != STATE_CLOSING);

  free(p);
}

static void on_close(uv_handle_t* handle) {
  veil_process_wrap* p = (veil_process_wrap*)handle;

  IOTJS_ASSERT(p != NULL);
  IOTJS_ASSERT(p->state == STATE_CLOSING);

  jerry_value_t self = p->self;

  p->self = jerry_undefined();
  p->state = STATE_CLOSED;

  jerry_value_free(self);
}

static void on_exit(uv_process_t* handle, int64_t exit_status, int term_signal) {
  veil_process_wrap* p = (veil_process_wrap*)handle;
  jerry_value_t callback = iotjs_jval_get_property(p->self, "onexit");

  if (jerry_value_is_function(callback)) {
    jerry_value_t argv[] = {
      jerry_number((double)exit_status),
      jerry_string_sz(signo_string(term_signal))
    };

    jerry_value_t result = jerry_call(callback, jerry_undefined(), argv, c_arraylen(argv));

    jerry_value_free(result);

    for (size_t i = 0; i < c_arraylen(argv); i++) {
      jerry_value_free(argv[i]);
    }
  }

  jerry_value_free(callback);
}

static const char* signo_string(int32_t signo) {
#define SIGNO_CASE(e)                                                          \
  case e:                                                                      \
    return #e;
  switch (signo) {
#ifdef SIGHUP
    SIGNO_CASE(SIGHUP);
#endif

#ifdef SIGINT
    SIGNO_CASE(SIGINT);
#endif

#ifdef SIGQUIT
    SIGNO_CASE(SIGQUIT);
#endif

#ifdef SIGILL
    SIGNO_CASE(SIGILL);
#endif

#ifdef SIGTRAP
    SIGNO_CASE(SIGTRAP);
#endif

#ifdef SIGABRT
    SIGNO_CASE(SIGABRT);
#endif

#ifdef SIGIOT
#if SIGABRT != SIGIOT
    SIGNO_CASE(SIGIOT);
#endif
#endif

#ifdef SIGBUS
    SIGNO_CASE(SIGBUS);
#endif

#ifdef SIGFPE
    SIGNO_CASE(SIGFPE);
#endif

#ifdef SIGKILL
    SIGNO_CASE(SIGKILL);
#endif

#ifdef SIGUSR1
    SIGNO_CASE(SIGUSR1);
#endif

#ifdef SIGSEGV
    SIGNO_CASE(SIGSEGV);
#endif

#ifdef SIGUSR2
    SIGNO_CASE(SIGUSR2);
#endif

#ifdef SIGPIPE
    SIGNO_CASE(SIGPIPE);
#endif

#ifdef SIGALRM
    SIGNO_CASE(SIGALRM);
#endif

    SIGNO_CASE(SIGTERM);

#ifdef SIGCHLD
    SIGNO_CASE(SIGCHLD);
#endif

#ifdef SIGSTKFLT
    SIGNO_CASE(SIGSTKFLT);
#endif

#ifdef SIGCONT
    SIGNO_CASE(SIGCONT);
#endif

#ifdef SIGSTOP
    SIGNO_CASE(SIGSTOP);
#endif

#ifdef SIGTSTP
    SIGNO_CASE(SIGTSTP);
#endif

#ifdef SIGBREAK
    SIGNO_CASE(SIGBREAK);
#endif

#ifdef SIGTTIN
    SIGNO_CASE(SIGTTIN);
#endif

#ifdef SIGTTOU
    SIGNO_CASE(SIGTTOU);
#endif

#ifdef SIGURG
    SIGNO_CASE(SIGURG);
#endif

#ifdef SIGXCPU
    SIGNO_CASE(SIGXCPU);
#endif

#ifdef SIGXFSZ
    SIGNO_CASE(SIGXFSZ);
#endif

#ifdef SIGVTALRM
    SIGNO_CASE(SIGVTALRM);
#endif

#ifdef SIGPROF
    SIGNO_CASE(SIGPROF);
#endif

#ifdef SIGWINCH
    SIGNO_CASE(SIGWINCH);
#endif

#ifdef SIGIO
    SIGNO_CASE(SIGIO);
#endif

#ifdef SIGPOLL
#if SIGPOLL != SIGIO
    SIGNO_CASE(SIGPOLL);
#endif
#endif

#ifdef SIGLOST
#if SIGLOST != SIGABRT
    SIGNO_CASE(SIGLOST);
#endif
#endif

#ifdef SIGPWR
#if SIGPWR != SIGLOST
    SIGNO_CASE(SIGPWR);
#endif
#endif

#ifdef SIGINFO
#if !defined(SIGPWR) || SIGINFO != SIGPWR
    SIGNO_CASE(SIGINFO);
#endif
#endif

#ifdef SIGSYS
    SIGNO_CASE(SIGSYS);
#endif

    default:
      return "";
  }
}

JS_FUNCTION(js_constuctor) {
  jerry_object_set_native_ptr(
      call_info_p->this_value,
      &this_module_native_info,
      veil_process_wrap_new());

  return jerry_undefined();
}

JS_FUNCTION(js_spawn) {
  DJS_CHECK_ARGS(1, object);
  JS_DECLARE_PTR(call_info_p->this_value, veil_process_wrap, process);
  int32_t err;
  uv_loop_t* loop = iotjs_environment_loop(iotjs_environment_get());
  jerry_value_t joptions = jargv[0];
  uv_process_options_t options;
  int32_t ivalue;
  cstr file;
  cstr cwd;

  memset(&options, 0, sizeof(uv_process_options_t));

  options.exit_cb = on_exit;

  // options.uid
  ivalue = iotjs_jval_get_property_as_int32(joptions, "uid", 0);

  if (ivalue > 0) {
    options.uid = ivalue;
    options.flags |= UV_PROCESS_SETUID;
  }

  // options.gid
  ivalue = iotjs_jval_get_property_as_int32(joptions, "gid", 0);

  if (ivalue > 0) {
    options.gid = ivalue;
    options.flags |= UV_PROCESS_SETGID;
  }

  // options.file
  file = iotjs_jval_get_property_as_string(joptions, "file");
  options.file = cstr_str_safe(&file);

  // options.args
  options.args = to_cstring_array(iotjs_jval_get_property(joptions, "args"));

  // options.cwd
  cwd = iotjs_jval_get_property_as_string(joptions, "cwd");

  if (!cstr_empty(cwd)) {
    options.cwd = cstr_str_safe(&cwd);
  }

  // options.env
  options.env = to_cstring_array(iotjs_jval_get_property(joptions, "env"));

  // options.stdio
  set_stdio_options(joptions, &options);

  // options.windowsHide
  if (iotjs_jval_get_property_as_bool(joptions, "windowsHide")) {
    options.flags |= UV_PROCESS_WINDOWS_HIDE;
  }

  //  if (env->hide_console_windows()) {
  //    options.flags |= UV_PROCESS_WINDOWS_HIDE_CONSOLE;
  //  }

  // options.windows_verbatim_arguments
  if (iotjs_jval_get_property_as_bool(joptions, "windows_verbatim_arguments")) {
    options.flags |= UV_PROCESS_WINDOWS_VERBATIM_ARGUMENTS;
  }

  // options.detached
  if (iotjs_jval_get_property_as_bool(joptions, "detached")) {
    options.flags |= UV_PROCESS_DETACHED;
  }

  err = veil_process_wrap_spawn(process, loop, call_info_p->this_value, &options);

  if (err == 0) {
    // CHECK_EQ(wrap->process_.data, wrap);
    iotjs_jval_set_property_number(call_info_p->this_value, "pid", process->handle.pid);
  }

  cstr_drop(&file);
  cstr_drop(&cwd);

  free_cstring_array(options.args);
  free_cstring_array(options.env);
  free(options.stdio);

  return jerry_number(err);
}

static void set_stdio_options(jerry_value_t joptions, uv_process_options_t* options) {
  jerry_value_t stdio_array = iotjs_jval_get_property(joptions, "stdio");

  if (!jerry_value_is_array(stdio_array)) {
    jerry_value_free(stdio_array);
    return;
  }

  jerry_length_t len = jerry_array_length(stdio_array);

  if (len == 0 || len > INT32_MAX) {
    jerry_value_free(stdio_array);
    return;
  }

  options->stdio = calloc(len, sizeof(uv_stdio_container_t));
  options->stdio_count = (int32_t)len;

  for (uint32_t i = 0; i < len; i++) {
    jerry_value_t stdio = jerry_object_get_index(stdio_array, i);
    cstr type = iotjs_jval_get_property_as_string(stdio, "type");

    if (cstr_eq_raw(&type, "ignore")) {
      options->stdio[i].flags = UV_IGNORE;
    } else if (cstr_eq_raw(&type, "pipe")) {
      IOTJS_ASSERT(false);
//      options->stdio[i].flags = static_cast<uv_stdio_flags>(
//          UV_CREATE_PIPE | UV_READABLE_PIPE | UV_WRITABLE_PIPE);
//      options->stdio[i].data.stream = StreamForWrap(env, stdio);
    } else if (cstr_eq_raw(&type, "overlapped")) {
      IOTJS_ASSERT(false);
//      options->stdio[i].flags = static_cast<uv_stdio_flags>(
//          UV_CREATE_PIPE | UV_READABLE_PIPE | UV_WRITABLE_PIPE |
//          UV_OVERLAPPED_PIPE);
//      options->stdio[i].data.stream = StreamForWrap(env, stdio);
    } else if (cstr_eq_raw(&type, "wrap")) {
      IOTJS_ASSERT(false);
//      options->stdio[i].flags = UV_INHERIT_STREAM;
//      options->stdio[i].data.stream = StreamForWrap(env, stdio);
    } else {
      options->stdio[i].flags = UV_INHERIT_FD;
      options->stdio[i].data.fd = iotjs_jval_get_property_as_int32(stdio, "fd", -1);
    }

    cstr_drop(&type);
    jerry_value_free(stdio);
  }

  jerry_value_free(stdio_array);
}

static char** to_cstring_array(jerry_value_t string_array) {
  char** result;

  if (jerry_value_is_array(string_array)) {
    jerry_length_t argc = jerry_array_length(string_array);
    jerry_value_t arg;
    jerry_size_t size;
    jerry_size_t written;

    result = calloc(argc + 1, sizeof(char*));

    for (jerry_length_t i = 0; i < argc; i++) {
      arg = jerry_object_get_index(string_array, i);
      size = jerry_string_size(arg, JERRY_ENCODING_UTF8);

      result[i] = malloc(size + 1);
      result[i][size] = '\0';

      if (size > 0) {
        written = jerry_string_to_buffer(arg, JERRY_ENCODING_UTF8, (jerry_char_t*)result[i], size);
        if (written != size) {
          result[i][0] = '\0';
        }
      }
    }

    result[argc] = NULL;
  } else {
    result = NULL;
  }

  return result;
}

static void free_cstring_array(char** cstring_array) {
  if (cstring_array) {
    // cstring_array is null terminated
    for (int i = 0; cstring_array[i]; i++) {
      free(cstring_array[i]);
    }
    free(cstring_array);
  }
}

JS_FUNCTION(js_kill) {
  DJS_CHECK_ARGS(1, number);
  JS_DECLARE_PTR(call_info_p->this_value, veil_process_wrap, process);

  return jerry_number(veil_process_wrap_kill(process, jerry_value_as_int32(jargv[0])));
}

JS_FUNCTION(js_close) {
  JS_DECLARE_PTR(call_info_p->this_value, veil_process_wrap, process);

  veil_process_wrap_close(process);
  return jerry_undefined();
}

JS_FUNCTION(js_has_ref) {
  JS_DECLARE_PTR(call_info_p->this_value, veil_process_wrap, process);

  return jerry_boolean(veil_process_wrap_has_ref(process));
}

JS_FUNCTION(js_ref) {
  JS_DECLARE_PTR(call_info_p->this_value, veil_process_wrap, process);

  veil_process_wrap_ref(process);

  return jerry_undefined();
}

JS_FUNCTION(js_unref) {
  JS_DECLARE_PTR(call_info_p->this_value, veil_process_wrap, process);

  veil_process_wrap_unref(process);

  return jerry_undefined();
}

jerry_value_t veil_process_wrap_constructor() {
  jerry_value_t constructor = jerry_function_external(js_constuctor);
  jerry_value_t prototype = jerry_object();

  iotjs_jval_set_method(prototype, "spawn", js_spawn);
  iotjs_jval_set_method(prototype, "kill", js_kill);
  iotjs_jval_set_method(prototype, "close", js_close);
  iotjs_jval_set_method(prototype, "hasRef", js_has_ref);
  iotjs_jval_set_method(prototype, "ref", js_ref);
  iotjs_jval_set_method(prototype, "unref", js_unref);

  iotjs_jval_set_prototype(constructor, prototype);

  return constructor;
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
