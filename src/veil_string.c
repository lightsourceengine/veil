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

#include "veil_string.h"

#include "iotjs_util.h"

veil_string_utf8 veil_string_utf8_from_iso_8859_1(const char* iso_8859_1, size_t length) {
  size_t i;
  char* buffer;
  uint8_t * buffer_position;
  size_t buffer_size = 0;
  uint8_t byte;

  for (i = 0; i < length; i++) {
    byte = (uint8_t)iso_8859_1[i];

    buffer_size++;

    if (byte >= 0x80) {
      buffer_size++;
    }
  }

  if (buffer_size == 0) {
    return (veil_string_utf8) {0};
  }

  buffer = iotjs_buffer_allocate(buffer_size + 1);
  buffer_position = (uint8_t*)buffer;

  for (i = 0; i < length; i++) {
    byte = (uint8_t)iso_8859_1[i];

    if (byte < 0x80) {
      *buffer_position++ = byte;
    }
    else {
      *buffer_position++ = (0xc0 | byte >> 6);
      *buffer_position++ = (0x80 | (byte & 0x3f));
    }
  }

  buffer[buffer_size] = '\0';

  return (veil_string_utf8) {
    .data = (uint8_t*)buffer,
    .length = buffer_size,
  };
}

veil_string_utf8 veil_string_utf8_from_utf16(const uint16_t* utf16_str, size_t length) {
  return (veil_string_utf8) {0};
}

void veil_string_utf8_drop(veil_string_utf8* str) {
  if (str && str->data) {
    iotjs_buffer_release((char*)str->data);
    str->data = NULL;
    str->length = 0;
  }
}
