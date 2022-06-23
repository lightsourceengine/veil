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

#pragma once

#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <stc/forward.h>

/* string format conversion */

cstr veil_string_utf8_from_iso_8859_1(const char* iso_8859_1, size_t length);
cstr veil_string_utf8_from_utf16(const uint16_t* utf16_str, size_t length);

size_t veil_string_copy_utf8_to_utf16(const uint8_t* utf8, size_t utf8_length, uint16_t* utf16, size_t utf16_length);
size_t veil_string_copy_utf8_to_iso_8859_1(const uint8_t* utf8, size_t utf8_length, char* iso_8859_1, size_t iso_8859_1_length);

/* cstr utility extensions */

cstr cstr_from_file(const char* path);
const char* cstr_str_safe(const cstr* str);
cstr* cstr_append_char(cstr* str, char ch);
char cstr_at(const cstr* str, size_t index);
bool cstr_eq_raw(const cstr* s1, const char* s2);
