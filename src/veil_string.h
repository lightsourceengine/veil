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

typedef struct {
  uint8_t* data;
  size_t length;
} veil_string_utf8;

veil_string_utf8 veil_string_utf8_from_iso_8859_1(const char* iso_8859_1, size_t length);
veil_string_utf8 veil_string_utf8_from_utf16(const uint16_t* utf16_str, size_t length);

void veil_string_utf8_drop(veil_string_utf8* str);
