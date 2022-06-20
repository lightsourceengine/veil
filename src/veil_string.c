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
#include <libutf16/utf16_to_utf8.h>
#include <libutf16/utf8_to_utf16.h>
#include <libutf16/utf8_to_utf16_one.h>

cstr veil_string_utf8_from_iso_8859_1(const char* iso_8859_1, size_t length) {
  size_t i;
  cstr result;
  uint8_t* buffer_position;
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
    return cstr_init();
  }

  result = cstr_with_size(buffer_size, 0);
  buffer_position = (uint8_t*)cstr_data(&result);

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

  return result;
}

cstr veil_string_utf8_from_utf16(const uint16_t* utf16_str, size_t length) {
  if (length == 0) {
    return cstr_init();
  }

  cstr result = cstr_with_size(utf16_to_utf8_size(&utf16_str, length), 0);
  uint8_t* buffer = (uint8_t*)cstr_data(&result);
  size_t written = utf16_to_utf8(&utf16_str, &buffer, cstr_size(result), length);

  if (written != length) {
    cstr_drop(&result);
    result = cstr_init();
  }

  return result;
}

size_t veil_string_copy_utf8_to_utf16(const uint8_t* utf8, size_t utf8_length,
                                         uint16_t* utf16, size_t utf16_length) {
  if (utf16 == NULL) {
    return utf8_to_utf16_size(&utf8, utf8_length);
  }

  size_t copied = utf8_to_utf16(&utf8, &utf16, utf16_length, utf8_length);

  if (copied != utf16_length) {
    return 0;
  }

  return copied;
}

size_t veil_string_copy_utf8_to_iso_8859_1(const uint8_t* utf8, size_t utf8_length, char* iso_8859_1, size_t iso_8859_1_length) {
  size_t result;
  utf32_char_t codepoint;
  utf8_state_t state = 0;
  const uint8_t* pos = utf8;
  size_t length = utf8_length;
  size_t count = 0;

  while (true) {
    result = utf8_to_utf32_one(&codepoint, pos, length, &state);

    if (result == 0) {
      // hit null terminator
      break;
    } else if (result == (size_t)-1 || result == (size_t)-2) {
      // error: UTF-8 byte sequence is longer or shorter than expected
      count = 0;
      break;
    } else if (iso_8859_1) {
      if (codepoint > 0xFF) {
        // unsupported unicode character, fallback to ?
        codepoint = '?';
      }

      iso_8859_1[count] = (char)codepoint;
    }

    count++;
    pos += result;
    length -= result;
  }

  return count;
}
