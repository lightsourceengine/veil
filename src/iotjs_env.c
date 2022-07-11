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
#include <string.h>
#include <stc/coption.h>

typedef enum {
  // stc/coption status values
  OPT_STATUS_UNKNOWN = (int)'?',
  OPT_STATUS_MISSING = (int)':',
  OPT_STATUS_END = -1,

  // general options
  OPT_HELP = (int)'h',
  OPT_VERSION = (int)'v',
  OPT_CONDITIONS = (int)'C',
  OPT_EXPOSE_GC = 0x103,
  OPT_NO_ADDON = 0x104,
  OPT_EXPOSE_INTERNALS = 0x105,
  OPT_PRESERVE_SYMLINKS = 0x106,
  OPT_PRESERVE_SYMLINKS_MAIN = 0x107,
  OPT_LOADER = 0x108,
  OPT_ESM_SPECIFIER_RESOLUTION = 0x109,

  // debugger options (compile time switch enabled)
  OPT_DEBUG_SERVER = (int)'d',
  OPT_DEBUGGER_WAIT_SOURCE = (int)'w',
  OPT_DEBUG_PORT = 0x201,
  OPT_DEBUG_CHANNEL = 0x202,
  OPT_DEBUG_PROTOCOL = 0x203,
  OPT_DEBUG_SERIAL_CONFIG = 0x204,

  // memory stats (compile time switch enabled)
  OPT_MEM_STATS = 0x301,

  // parser byte codes (compile time switch enabled)
  OPT_SHOW_OP = 0x401,
} cli_option_id_t;

typedef struct {
  const cli_option_id_t id;
  const char* opt;
  const char* longopt;
  const char* help;
  const uint32_t more; // The number of options coming with the given option
} cli_option_t;

static void print_version();
static void print_help();

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

static void print_version() {
  printf("v%s\n", VEIL_VERSION_STRING);
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


/**
 * Parse command line arguments
 */
bool iotjs_environment_parse_command_line_arguments(iotjs_environment_t* env,
                                                    int argc,
                                                    char** argv) {
  // note: + at position 0 stops cl processing when a non-dashed option is hit
  const char* shortopts = "+hvC:dw:";
  coption_long longopts[] = {
    { "help", coption_no_argument, OPT_HELP },
    { "expose-gc", coption_no_argument, OPT_EXPOSE_GC },
    { "no-addon", coption_no_argument, OPT_NO_ADDON },
    { "version", coption_no_argument, OPT_VERSION },
    { "expose-internals", coption_no_argument, OPT_EXPOSE_INTERNALS },
    { "preserve-symlinks", coption_no_argument, OPT_PRESERVE_SYMLINKS },
    { "preserve-symlinks-main", coption_no_argument, OPT_PRESERVE_SYMLINKS_MAIN },
    { "loader", coption_required_argument, OPT_LOADER },
    { "conditions", coption_required_argument, OPT_CONDITIONS },
    { "es-module-specifier-resolution", coption_required_argument, OPT_ESM_SPECIFIER_RESOLUTION },
#ifdef JERRY_MEM_STATS
    { "mem-stats", coption_no_argument, OPT_MEM_STATS },
#endif
#ifdef JERRY_PARSER_DUMP_BYTE_CODE
    { "dump-byte-code", coption_no_argument, OPT_SHOW_OP },
#endif
#ifdef JERRY_DEBUGGER
    { "start-debug-server", coption_no_argument, OPT_DEBUG_SERVER },
    { "debugger-wait-source", coption_no_argument, OPT_DEBUGGER_WAIT_SOURCE },
    { "debug-port", coption_required_argument, OPT_DEBUG_PORT },
    { "debug-channel", coption_required_argument, OPT_DEBUG_CHANNEL },
    { "debug-protocol", coption_required_argument, OPT_DEBUG_PROTOCOL },
    { "debug-serial-config", coption_required_argument, OPT_DEBUG_SERIAL_CONFIG },
#endif
    {0}
  };

  int32_t value;
  coption opt = coption_init();

  while ((value = coption_get(&opt, argc, argv, shortopts, longopts)) != OPT_STATUS_END) {
    switch (value) {
      case OPT_HELP:
        print_help();
        exit(0);
        break;
      case OPT_VERSION:
        print_version();
        exit(0);
        break;
      case OPT_EXPOSE_GC:
        env->config.expose_gc = true;
        break;
      case OPT_NO_ADDON:
        env->config.enable_napi = false;
        break;
      case OPT_PRESERVE_SYMLINKS:
        env->config.preserve_symlinks = true;
        break;
      case OPT_PRESERVE_SYMLINKS_MAIN:
        env->config.preserve_symlinks_main = true;
        break;
      case OPT_EXPOSE_INTERNALS:
        env->config.expose_internals = true;
        break;
      case OPT_LOADER:
        cstr_drop(&env->esm_loader_script);
        env->esm_loader_script = cstr_from(opt.arg);
        // TODO: assign seg faults: cstr_assign(&env->loader_script, opt.arg);
        break;
      case OPT_CONDITIONS:
        cvec_str_emplace_back(&env->esm_conditions, opt.arg);
        break;
      case OPT_ESM_SPECIFIER_RESOLUTION: {
        const char* algorithm = opt.arg;

        cstr_clear(&env->esm_specifier_resolution);

        if (strcmp("explicit", algorithm) == 0 || strcmp("node", algorithm) == 0) {
          cstr_assign(&env->esm_specifier_resolution, algorithm);
        } else {
          fprintf(stderr, "veil: --es-module-specifier-resolution requires an argument\n");
          return false;
        }

        break;
      }
      case OPT_MEM_STATS:
        env->config.memstat = true;
        break;
      case OPT_SHOW_OP:
        env->config.show_opcode = true;
        break;
#ifdef JERRY_DEBUGGER
      case OPT_DEBUGGER_WAIT_SOURCE:
      case OPT_DEBUG_SERVER: {
        if (!env->config.debugger) {
          env->config.debugger =
              (DebuggerConfig*)iotjs_buffer_allocate(sizeof(DebuggerConfig));
        }
        env->config.debugger->port = 5001;
        env->config.debugger->context_reset = false;
        env->config.debugger->wait_source =
            cur_opt->id == OPT_DEBUGGER_WAIT_SOURCE;
        char default_channel[] = "websocket";
        char default_protocol[] = "tcp";
        char default_serial_config[] = "/dev/ttyS0,115200,8,N,1";
        memcpy(env->config.debugger->channel, default_channel,
               strlen(default_channel) + 1);
        memcpy(env->config.debugger->protocol, default_protocol,
               strlen(default_protocol) + 1);
        memcpy(env->config.debugger->serial_config, default_serial_config,
               strlen(default_serial_config) + 1);
      } break;
      case OPT_DEBUG_PORT: {
        if (env->config.debugger) {
          if (i + 1 >= argc) {
            fprintf(stderr,"veil: --port requires an argument\n");
            return false;
          }
          char* pos = NULL;
          env->config.debugger->port = (uint16_t)strtoul(argv[i + 1], &pos, 10);
        }
        i++;
      } break;
      case OPT_DEBUG_CHANNEL: {
        if (env->config.debugger) {
          memset(env->config.debugger->channel, 0,
                 strlen(env->config.debugger->channel) + 1);
          memcpy(env->config.debugger->channel, argv[i + 1],
                 strlen(argv[i + 1]) + 1);

          if (strcmp(env->config.debugger->channel, "websocket") &&
              strcmp(env->config.debugger->channel, "rawpacket")) {
            fprintf(stderr,
                    "Debug channel %s is not supported."
                    " Only websocket or rawpacket is allowed\n",
                    env->config.debugger->channel);
            return false;
          }
        }
        i++;
      } break;
      case OPT_DEBUG_PROTOCOL: {
        if (env->config.debugger) {
          memset(env->config.debugger->protocol, 0,
                 strlen(env->config.debugger->protocol) + 1);
          memcpy(env->config.debugger->protocol, argv[i + 1],
                 strlen(argv[i + 1]) + 1);

          if (strcmp(env->config.debugger->protocol, "tcp") &&
              strcmp(env->config.debugger->protocol, "serial")) {
            fprintf(stderr,
                    "Debug protocol %s is not supported."
                    " Only tcp or serial is allowed\n",
                    env->config.debugger->protocol);
            return false;
          }
        }
        i++;
      } break;
      case OPT_DEBUG_SERIAL_CONFIG: {
        if (env->config.debugger) {
          memset(env->config.debugger->serial_config, 0,
                 strlen(env->config.debugger->serial_config) + 1);
          memcpy(env->config.debugger->serial_config, argv[i + 1],
                 strlen(argv[i + 1]) + 1);
        }
        i++;
      } break;
#endif
      case OPT_STATUS_MISSING:
        printf("veil: %s requires an argument\n", opt.optstr);
        return false;
      default:
        printf("veil: unknown option: %s\n", opt.optstr);
        return false;
    }
  }

#ifdef JERRY_DEBUGGER
  // If IoT.js is waiting for source from the debugger client,
  // Further processing over command line argument is not needed.
  if (env->config.debugger && env->config.debugger->wait_source)
    return true;
#endif

  int32_t i = opt.ind;

  // There must be at least one argument after processing the IoT.js args,
  if (argc - i < 1) {

    return false;
  }

  env->argv0 = argv[0];
  // Remaining arguments are for application.
  env->argc = 2;
  size_t buffer_size = ((size_t)(env->argc + argc - i)) * sizeof(char*);
  env->argv = (char**)iotjs_buffer_allocate(buffer_size);
  env->argv[0] = argv[0];
  env->argv[1] = argv[i++];

  // Clonning for argv is not required.
  // 1) We will only read
  // 2) Standard C guarantees that strings pointed by the argv array shall
  //    retain between program startup and program termination
  while (i < argc)
    env->argv[env->argc++] = argv[i++];

  return true;
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

static void print_help() {
  printf("Usage: veil [options] [script.mjs] [arguments]\n\nOptions:\n");

  printf("  -h, --help                      print this help and exit                      \n");
  printf("  -v, --version                   print veil version                            \n");
  printf("  --expose-gc                     expose gc() function in global namespace      \n");
  printf("  --no-addon                      disable loading native addons                 \n");
  printf("  --expose-internals              enable importing of internal builtin modules  \n");
  printf("  --preserve-symlinks             preserve symbolic links when resolving        \n");
  printf("  --preserve-symlinks-main        preserve symbolic links when resolving        \n"
         "                                  the main module                               \n");
  printf("  --loader                        use the specified module as a custom loader   \n");
  printf("  -C, --conditions=...            additional user conditions for conditional    \n"
         "                                  exports and imports                           \n");
  printf("  --es-module-specifier-resolution=...                                          \n"
         "                                  select extension resolution algorithm for es  \n"
         "                                  modules; either 'explicit' (default) or 'node'\n");

#ifdef JERRY_MEM_STATS
  printf("  --mem-stats                     dump memory statistics                        \n");
#endif

#ifdef JERRY_PARSER_DUMP_BYTE_CODE
  printf("  --dump-byte-code                dump parser byte code                         \n");
#endif

#ifdef JERRY_DEBUGGER
  printf("  -d, --start-debug-server        start debug server and wait for a             \n"
         "                                  connecting client                             \n");
  printf("  -w, --debugger-wait-source      wait for an executable source from the client \n");
  printf("  --debug-port=...                debug server port (default: 5001)             \n");
  printf("  --debug-channel=...             specify the debugger transmission channel     \n"
         "                                  (default: websocket)                          \n");
  printf("  --debug-protocol=...            specify the transmission protocol over the    \n"
         "                                  communication channel (default: tcp)          \n");
  printf("  --debug-serial-config=...       configure parameters for serial port          \n"
         "                                  (default: /dev/ttyS0,115200,8,N,1)            \n");
#endif
  printf("\n");
}
