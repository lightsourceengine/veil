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

#include "cvec_str.h"

#define GEN_VEIL_URL_PARSE_STATES(XX)                                         \
  XX(kSchemeStart)                                                            \
  XX(kScheme)                                                                 \
  XX(kNoScheme)                                                               \
  XX(kSpecialRelativeOrAuthority)                                             \
  XX(kPathOrAuthority)                                                        \
  XX(kRelative)                                                               \
  XX(kRelativeSlash)                                                          \
  XX(kSpecialAuthoritySlashes)                                                \
  XX(kSpecialAuthorityIgnoreSlashes)                                          \
  XX(kAuthority)                                                              \
  XX(kHost)                                                                   \
  XX(kHostname)                                                               \
  XX(kPort)                                                                   \
  XX(kFile)                                                                   \
  XX(kFileSlash)                                                              \
  XX(kFileHost)                                                               \
  XX(kPathStart)                                                              \
  XX(kPath)                                                                   \
  XX(kCannotBeBase)                                                           \
  XX(kQuery)                                                                  \
  XX(kFragment)

#define GEN_VEIL_URL_FLAGS(XX)                                                \
  XX(URL_FLAGS_NONE, 0)                                                       \
  XX(URL_FLAGS_FAILED, 0x01)                                                  \
  XX(URL_FLAGS_CANNOT_BE_BASE, 0x02)                                          \
  XX(URL_FLAGS_INVALID_PARSE_STATE, 0x04)                                     \
  XX(URL_FLAGS_TERMINATED, 0x08)                                              \
  XX(URL_FLAGS_SPECIAL, 0x10)                                                 \
  XX(URL_FLAGS_HAS_USERNAME, 0x20)                                            \
  XX(URL_FLAGS_HAS_PASSWORD, 0x40)                                            \
  XX(URL_FLAGS_HAS_HOST, 0x80)                                                \
  XX(URL_FLAGS_HAS_PATH, 0x100)                                               \
  XX(URL_FLAGS_HAS_QUERY, 0x200)                                              \
  XX(URL_FLAGS_HAS_FRAGMENT, 0x400)                                           \
  XX(URL_FLAGS_IS_DEFAULT_SCHEME_PORT, 0x800)                                 \

typedef enum veil_url_parse_state {
  kUnknownState = -1,
#define XX(name) name,
  GEN_VEIL_URL_PARSE_STATES(XX)
#undef XX
} veil_url_parse_state;

typedef enum veil_url_flags {
#define XX(name, val) name = val,
  GEN_VEIL_URL_FLAGS(XX)
#undef XX
} veil_url_flags;

typedef struct veil_url_data {
  int32_t flags;
  int32_t port;
  cstr scheme;
  cstr username;
  cstr password;
  cstr host;
  cstr query;
  cstr fragment;
  cvec_str path;
  cstr href;
} veil_url_data;

veil_url_data veil_url_data_init();
void veil_url_data_drop(veil_url_data* url);

typedef enum veil_url_host_type {
  URL_HOST_FAILED,
  URL_HOST_DOMAIN,
  URL_HOST_IPV4,
  URL_HOST_IPV6,
  URL_HOST_OPAQUE,
} veil_url_host_type;

typedef union veil_url_host_value {
  cstr domain_or_opaque;
  uint32_t ipv4;
  uint16_t ipv6[8];
} veil_url_host_value;

typedef struct veil_url_host {
  veil_url_host_value value;
  veil_url_host_type type;
} veil_url_host;

veil_url_host veil_url_host_init();
void veil_url_host_reset(veil_url_host* host);

/*
 * Contains code from the following projects:
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */
