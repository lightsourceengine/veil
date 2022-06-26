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
#include "iotjs_compatibility.h"
#include "iotjs_module.h"
#include <signal.h>

static void add_fs_constants (jerry_value_t target);
static jerry_value_t define_os_signal_constants();
static jerry_value_t define_uv_errno_constants();

jerry_value_t veil_init_constants(void) {
  jerry_value_t jexports = jerry_object();
  jerry_value_t os = jerry_object();
  jerry_value_t os_signals = define_os_signal_constants();
  jerry_value_t uv = jerry_object();
  jerry_value_t uv_errno = define_uv_errno_constants();

  iotjs_jval_set_property_jval(jexports, "os", os);
  iotjs_jval_set_property_jval(jexports, "uv", uv);

  add_fs_constants(jexports);

  iotjs_jval_set_property_jval(os, "signals", os_signals);
  iotjs_jval_set_property_jval(uv, "errno", uv_errno);

  jerry_value_free(os);
  jerry_value_free(os_signals);
  jerry_value_free(uv);
  jerry_value_free(uv_errno);

  return jexports;
}

static void add_fs_constants (jerry_value_t target) {
  VEIL_DEFINE_CONSTANT(target, O_APPEND);
  VEIL_DEFINE_CONSTANT(target, O_CREAT);
  VEIL_DEFINE_CONSTANT(target, O_EXCL);
  VEIL_DEFINE_CONSTANT(target, O_RDONLY);
  VEIL_DEFINE_CONSTANT(target, O_RDWR);
  VEIL_DEFINE_CONSTANT(target, O_SYNC);
  VEIL_DEFINE_CONSTANT(target, O_TRUNC);
  VEIL_DEFINE_CONSTANT(target, O_WRONLY);
  VEIL_DEFINE_CONSTANT(target, S_IFMT);
  VEIL_DEFINE_CONSTANT(target, S_IFDIR);
  VEIL_DEFINE_CONSTANT(target, S_IFREG);
}

static jerry_value_t define_uv_errno_constants() {
  jerry_value_t target = jerry_object();

#define XX(name, _) VEIL_DEFINE_CONSTANT(target, UV_ ## name);
  UV_ERRNO_MAP(XX)
#undef XX

  return target;
}

static jerry_value_t define_os_signal_constants() {
  jerry_value_t target = jerry_object();

#ifdef SIGHUP
  VEIL_DEFINE_CONSTANT(target, SIGHUP);
#endif

#ifdef SIGINT
  VEIL_DEFINE_CONSTANT(target, SIGINT);
#endif

#ifdef SIGQUIT
  VEIL_DEFINE_CONSTANT(target, SIGQUIT);
#endif

#ifdef SIGILL
  VEIL_DEFINE_CONSTANT(target, SIGILL);
#endif

#ifdef SIGTRAP
  VEIL_DEFINE_CONSTANT(target, SIGTRAP);
#endif

#ifdef SIGABRT
  VEIL_DEFINE_CONSTANT(target, SIGABRT);
#endif

#ifdef SIGIOT
  VEIL_DEFINE_CONSTANT(target, SIGIOT);
#endif

#ifdef SIGBUS
  VEIL_DEFINE_CONSTANT(target, SIGBUS);
#endif

#ifdef SIGFPE
  VEIL_DEFINE_CONSTANT(target, SIGFPE);
#endif

#ifdef SIGKILL
  VEIL_DEFINE_CONSTANT(target, SIGKILL);
#endif

#ifdef SIGUSR1
  VEIL_DEFINE_CONSTANT(target, SIGUSR1);
#endif

#ifdef SIGSEGV
  VEIL_DEFINE_CONSTANT(target, SIGSEGV);
#endif

#ifdef SIGUSR2
  VEIL_DEFINE_CONSTANT(target, SIGUSR2);
#endif

#ifdef SIGPIPE
  VEIL_DEFINE_CONSTANT(target, SIGPIPE);
#endif

#ifdef SIGALRM
  VEIL_DEFINE_CONSTANT(target, SIGALRM);
#endif

  VEIL_DEFINE_CONSTANT(target, SIGTERM);

#ifdef SIGCHLD
  VEIL_DEFINE_CONSTANT(target, SIGCHLD);
#endif

#ifdef SIGSTKFLT
  VEIL_DEFINE_CONSTANT(target, SIGSTKFLT);
#endif


#ifdef SIGCONT
  VEIL_DEFINE_CONSTANT(target, SIGCONT);
#endif

#ifdef SIGSTOP
  VEIL_DEFINE_CONSTANT(target, SIGSTOP);
#endif

#ifdef SIGTSTP
  VEIL_DEFINE_CONSTANT(target, SIGTSTP);
#endif

#ifdef SIGBREAK
  VEIL_DEFINE_CONSTANT(target, SIGBREAK);
#endif

#ifdef SIGTTIN
  VEIL_DEFINE_CONSTANT(target, SIGTTIN);
#endif

#ifdef SIGTTOU
  VEIL_DEFINE_CONSTANT(target, SIGTTOU);
#endif

#ifdef SIGURG
  VEIL_DEFINE_CONSTANT(target, SIGURG);
#endif

#ifdef SIGXCPU
  VEIL_DEFINE_CONSTANT(target, SIGXCPU);
#endif

#ifdef SIGXFSZ
  VEIL_DEFINE_CONSTANT(target, SIGXFSZ);
#endif

#ifdef SIGVTALRM
  VEIL_DEFINE_CONSTANT(target, SIGVTALRM);
#endif

#ifdef SIGPROF
  VEIL_DEFINE_CONSTANT(target, SIGPROF);
#endif

#ifdef SIGWINCH
  VEIL_DEFINE_CONSTANT(target, SIGWINCH);
#endif

#ifdef SIGIO
  VEIL_DEFINE_CONSTANT(target, SIGIO);
#endif

#ifdef SIGPOLL
  VEIL_DEFINE_CONSTANT(target, SIGPOLL);
#endif

#ifdef SIGLOST
  VEIL_DEFINE_CONSTANT(target, SIGLOST);
#endif

#ifdef SIGPWR
  VEIL_DEFINE_CONSTANT(target, SIGPWR);
#endif

#ifdef SIGINFO
  VEIL_DEFINE_CONSTANT(target, SIGINFO);
#endif

#ifdef SIGSYS
  VEIL_DEFINE_CONSTANT(target, SIGSYS);
#endif

#ifdef SIGUNUSED
  VEIL_DEFINE_CONSTANT(target, SIGUNUSED);
#endif

  return target;
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/jerryscript-project/iotjs
 * Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
