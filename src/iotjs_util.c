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
#include "iotjs_util.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#if defined(__linux__) && !defined(__OPENWRT__)
#include <execinfo.h>
#endif

void force_terminate(void);

iotjs_string_t iotjs_file_read(const char* path) {
  FILE* file = fopen(path, "rb");
  if (file == NULL) {
    iotjs_string_t empty_content = iotjs_string_create();
    return empty_content;
  }

  int fseek_ret = fseek(file, 0, SEEK_END);
  IOTJS_ASSERT(fseek_ret == 0);
  long ftell_ret = ftell(file);
  IOTJS_ASSERT(ftell_ret >= 0);
  size_t len = (size_t)ftell_ret;
  fseek_ret = fseek(file, 0, SEEK_SET);
  IOTJS_ASSERT(fseek_ret == 0);

  if (ftell_ret < 0 || fseek_ret != 0) {
    iotjs_string_t empty_content = iotjs_string_create();
    fclose(file);
    DLOG("iotjs_file_read error");
    return empty_content;
  }

  char* buffer = iotjs_buffer_allocate(len + 1);

#if defined(__NUTTX__) || defined(__TIZENRT__)
  char* ptr = buffer;
  unsigned nread = 0;
  unsigned read = 0;

  while ((nread = fread(ptr, 1, IOTJS_MAX_READ_BUFFER_SIZE, file)) > 0) {
    read += nread;
    ptr = buffer + read;
  }
#else
  size_t read = fread(buffer, 1, len, file);
#endif
  IOTJS_ASSERT(read == len);

  *(buffer + len) = 0;

  fclose(file);

  iotjs_string_t contents = iotjs_string_create_with_buffer(buffer, len);

  return contents;
}

char* iotjs_buffer_allocate(size_t size) {
  char* buffer = (char*)(calloc(size, sizeof(char)));
  if (buffer == NULL) {
    DLOG("Out of memory");
    force_terminate();
  }
  return buffer;
}


char* iotjs_buffer_allocate_from_number_array(size_t size,
                                              const jerry_value_t array) {
  char* buffer = iotjs_buffer_allocate(size);
  for (size_t i = 0; i < size; i++) {
    jerry_value_t jdata = iotjs_jval_get_property_by_index(array, i);
    buffer[i] = (char)iotjs_jval_as_number(jdata);
    jerry_value_free(jdata);
  }
  return buffer;
}


char* iotjs_buffer_reallocate(char* buffer, size_t size) {
  IOTJS_ASSERT(buffer != NULL);
  char* newbuffer = (char*)(realloc(buffer, size));
  if (newbuffer == NULL) {
    DLOG("Out of memory");
    force_terminate();
  }
  return newbuffer;
}


void iotjs_buffer_release(char* buffer) {
  if (buffer) {
    free(buffer);
  }
}

char* iotjs_string_to_utf8(jerry_value_t str, char* buffer, size_t size) {
  size_t copied;

  copied = jerry_string_to_buffer(
      str,
      JERRY_ENCODING_UTF8,
      (jerry_char_t*)buffer,
      size);
  buffer[copied] = '\0';

  return buffer;
}

void iotjs_print_jval(jerry_value_t val) {
  jerry_value_t to_string;
  jerry_value_t stack;

  if (jerry_value_is_exception(val)) {
    jerry_value_t e = jerry_exception_value(val, false);

    to_string = jerry_value_to_string(e);
    stack = jerry_object_get_sz(e, "stack");

    jerry_value_free(e);
  } else {
    to_string = jerry_value_to_string(val);
    stack = jerry_undefined();
  }

  if (jerry_value_is_exception(to_string)) {
    printf("could not convert value to string\n");
  } else {
    iotjs_string_t buffer = iotjs_jval_as_string(to_string);

    printf("%s\n", iotjs_string_data(&buffer));

    if (jerry_value_is_array(stack)) {
      jerry_length_t len = jerry_array_length(stack);

      for (jerry_length_t i = 0; i < len; i++) {
        jerry_value_t jline = jerry_object_get_index(stack, i);
        iotjs_string_t line = iotjs_jval_as_string(jline);

        printf("    at  %s\n", iotjs_string_data(&line));
        iotjs_string_destroy(&line);
        jerry_value_free(jline);
      }
    }

    iotjs_string_destroy(&buffer);
  }

  jerry_value_free(to_string);
  jerry_value_free(stack);
}

void print_stacktrace(void) {
#if !defined(NDEBUG) && defined(__linux__) && defined(DEBUG) && \
    !defined(__OPENWRT__)
  // TODO: support other platforms
  const int numOfStackTrace = 100;
  void* buffer[numOfStackTrace];
  char command[256];

  int nptrs = backtrace(buffer, numOfStackTrace);
  char** strings = backtrace_symbols(buffer, nptrs);

  if (strings == NULL) {
    perror("backtrace_symbols");
    exit(EXIT_FAILURE);
  }

  printf("\n[Backtrace]:\n");
  for (int j = 0; j < nptrs - 2; j++) { // remove the last two
    int idx = 0;
    while (strings[j][idx] != '\0') {
      if (strings[j][idx] == '(') {
        break;
      }
      idx++;
    }
    snprintf(command, sizeof(command), "addr2line %p -e %.*s", buffer[j], idx,
             strings[j]);

    if (system(command)) {
      break;
    }
  }

  free(strings);
#endif // !defined(NDEBUG) && defined(__linux__) && defined(DEBUG) &&
       // !defined(__OPENWRT__)
}

void force_terminate(void) {
  exit(EXIT_FAILURE);
}
