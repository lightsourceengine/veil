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

#include <stdint.h>

const uint8_t VEIL_URL_QUERY_ENCODE_SET_SPECIAL[32];
const uint8_t VEIL_URL_QUERY_ENCODE_SET_NONSPECIAL[32];
const uint8_t VEIL_URL_USERINFO_ENCODE_SET[32];
const uint8_t VEIL_URL_PATH_ENCODE_SET[32];
const uint8_t VEIL_URL_FRAGMENT_ENCODE_SET[32];
const uint8_t VEIL_URL_C0_CONTROL_ENCODE_SET[32];
const char VEIL_URL_HEX[1024];

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
