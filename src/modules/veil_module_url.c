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

#include "veil_module_url.h"
#include "veil_module_url_tables.h"
#include <math.h>

#define NS_IN6ADDRSZ 16
// https://url.spec.whatwg.org/#eof-code-point
#define kEOL -1

#define VEIL_DEFINE_CONSTANT(target, name) \
  iotjs_jval_set_property_number(target, STRINGIFY(name), name)

#define CHAR_TEST(bits, name, expr)                                           \
  static bool name(char ch) {                                                 \
    return (expr);                                                            \
  }

// https://url.spec.whatwg.org/#forbidden-host-code-point
CHAR_TEST(8, is_forbidden_host_codepoint,
          ch == '\0' || ch == '\t' || ch == '\n' || ch == '\r' ||
              ch == ' ' || ch == '#' || ch == '%' || ch == '/' ||
              ch == ':' || ch == '?' || ch == '@' || ch == '[' ||
              ch == '<' || ch == '>' || ch == '\\' || ch == ']' ||
              ch == '^' || ch == '|')

// https://infra.spec.whatwg.org/#ascii-tab-or-newline
CHAR_TEST(8, IsASCIITabOrNewline, (ch == '\t' || ch == '\n' || ch == '\r'))

// https://infra.spec.whatwg.org/#c0-control-or-space
CHAR_TEST(8, IsC0ControlOrSpace, (ch >= '\0' && ch <= ' '))

// https://infra.spec.whatwg.org/#ascii-digit
CHAR_TEST(8, IsASCIIDigit, (ch >= '0' && ch <= '9'))

// https://infra.spec.whatwg.org/#ascii-hex-digit
CHAR_TEST(8, IsASCIIHexDigit, (IsASCIIDigit(ch) ||
                               (ch >= 'A' && ch <= 'F') ||
                               (ch >= 'a' && ch <= 'f')))

// https://infra.spec.whatwg.org/#ascii-alpha
CHAR_TEST(8, IsASCIIAlpha, ((ch >= 'A' && ch <= 'Z') ||
                            (ch >= 'a' && ch <= 'z')))

// https://infra.spec.whatwg.org/#ascii-alphanumeric
CHAR_TEST(8, IsASCIIAlphanumeric, (IsASCIIDigit(ch) || IsASCIIAlpha(ch)))

#define ARGS(XX)                                                              \
  XX(ARG_FLAGS)                                                               \
  XX(ARG_PROTOCOL)                                                            \
  XX(ARG_USERNAME)                                                            \
  XX(ARG_PASSWORD)                                                            \
  XX(ARG_HOST)                                                                \
  XX(ARG_PORT)                                                                \
  XX(ARG_PATH)                                                                \
  XX(ARG_QUERY)                                                               \
  XX(ARG_FRAGMENT)                                                            \
  XX(ARG_COUNT)  // This one has to be last.

enum url_cb_args {
#define XX(name) name,
  ARGS(XX)
#undef XX
};

static char ascii_lowercase(char ch);
static void append_or_escape(cstr* str, unsigned char ch, const uint8_t encode_set[]);
static bool bit_at(const uint8_t a[], uint8_t i);
static uint32_t hex_to_bin(char ch);
static cstr percent_decode(const char* input, size_t len);
static int64_t parse_number(const char* start, const char* end);
static bool is_special(cstr* scheme);
static jerry_value_t get_special(const cstr* scheme);
static int normalize_port(cstr* scheme, int p);
static bool is_windows_drive_letter(char ch1, char ch2);
static bool is_normalized_windows_drive_letter(const cstr* str);
static bool starts_with_windows_driver_letter(const char* p, const char* end);
static void shorten_url_path(veil_url_data* url);
static bool is_double_dot_segment(cstr* str);
static bool is_single_dot_segment(cstr* str);
static bool parse_host(const cstr* input, cstr* output, bool is_special, bool unicode);

veil_url_data veil_url_data_init() {
  return (veil_url_data) {
    .flags = URL_FLAGS_NONE,
    .port = -1,
    .scheme = cstr_init(),
    .username = cstr_init(),
    .password = cstr_init(),
    .host = cstr_init(),
    .query = cstr_init(),
    .fragment = cstr_init(),
    .path = cvec_str_init(),
    .href = cstr_init()
  };
}

void veil_url_data_drop(veil_url_data* url) {
  if (url) {
    cstr_drop(&url->scheme);
    cstr_drop(&url->username);
    cstr_drop(&url->password);
    cstr_drop(&url->host);
    cstr_drop(&url->query);
    cstr_drop(&url->fragment);
    cstr_drop(&url->href);
    cvec_str_drop(&url->path);

    *url = veil_url_data_init();
  }
}

veil_url_host veil_url_host_init() {
  return (veil_url_host) {
    .value = {0},
    .type = URL_HOST_FAILED
  };
}

void veil_url_host_drop(veil_url_host* host) {
  if (host) {
    veil_url_host_reset(host);
  }
}

void veil_url_host_reset(veil_url_host* host) {
  switch (host->type) {
    case URL_HOST_DOMAIN:
    case URL_HOST_OPAQUE:
      cstr_drop(&host->value.domain_or_opaque);
      host->value.ipv4 = 0;
      break;
    default:
      break;
  }
  host->type = URL_HOST_FAILED;
}

const char* veil_url_host_to_string(veil_url_host* host) {
  switch (host->type) {
    case URL_HOST_DOMAIN:
    case URL_HOST_OPAQUE:
      return cstr_str_safe(&host->value.domain_or_opaque);
    default:
      return "";
  }
}

void veil_url_host_set_opaque(veil_url_host* host, cstr* value) {
  veil_url_host_reset(host);
  host->type = URL_HOST_OPAQUE;
  host->value.domain_or_opaque = *value;
}

void veil_url_host_set_domain(veil_url_host* host, cstr* value) {
  veil_url_host_reset(host);
  host->type = URL_HOST_DOMAIN;
  host->value.domain_or_opaque = *value;
}

void veil_url_host_parse_ipv4_host(veil_url_host* host, const char* input, size_t length, bool* is_ipv4) {
//  CHECK_EQ(type_, HostType::H_FAILED);
  *is_ipv4 = false;
  const char* pointer = input;
  const char* mark = input;
  const char* end = pointer + length;
  int parts = 0;
  uint32_t val = 0;
  #define NUMBERS_SIZE 4
  uint64_t numbers[NUMBERS_SIZE];
  int tooBigNumbers = 0;
  if (length == 0)
    return;

  while (pointer <= end) {
    const char ch = pointer < end ? pointer[0] : kEOL;
    int64_t remaining = end - pointer - 1;
    if (ch == '.' || ch == kEOL) {
      if (++parts > NUMBERS_SIZE) return;
      if (pointer == mark)
        return;
      int64_t n = parse_number(mark, pointer);
      if (n < 0)
        return;

      if (n > 255) {
        tooBigNumbers++;
      }
      numbers[parts - 1] = n;
      mark = pointer + 1;
      if (ch == '.' && remaining == 0)
        break;
    }
    pointer++;
  }
//  CHECK_GT(parts, 0);
  *is_ipv4 = true;

  // If any but the last item in numbers is greater than 255, return failure.
  // If the last item in numbers is greater than or equal to
  // 256^(5 - the number of items in numbers), return failure.
  if (tooBigNumbers > 1 || (tooBigNumbers == 1 && numbers[parts - 1] <= 255)
      || (double)numbers[parts - 1] >= pow(256, (double)(5 - parts))) {
    return;
  }

  host->type = URL_HOST_IPV4;
  val = (uint32_t)numbers[parts - 1];

  for (int32_t n = 0; n < parts - 1; n++) {
    double b = 3 - n;
    val += (uint32_t)(numbers[n]) * (uint32_t)(pow(256, b));
  }

  host->value.ipv4 = val;
}

void veil_url_host_parse_ipv6_host(veil_url_host* host, const char* input, size_t length) {
  // CHECK_EQ(type_, HostType::H_FAILED);

  uint8_t buf[sizeof(struct in6_addr)];
  cstr ipv6 = cstr_from_n(input, length);
  int ret = uv_inet_pton(AF_INET6, cstr_str(&ipv6), buf);

  cstr_drop(&ipv6);

  if (ret == 0) {
    // Ref: https://sourceware.org/git/?p=glibc.git;a=blob;f=resolv/inet_ntop.c;h=c4d38c0f951013e51a4fc6eaa8a9b82e146abe5a;hb=HEAD#l119
    for (int i = 0; i < NS_IN6ADDRSZ; i += 2) {
      host->value.ipv6[i >> 1] = (buf[i] << 8) | buf[i + 1];
    }

    host->type = URL_HOST_IPV6;
  }
}

void veil_url_host_parse_opaque_host(veil_url_host* host, const char* input, size_t length) {
  // CHECK_EQ(type_, HostType::H_FAILED);

  cstr output = cstr_with_capacity(length);

  for (size_t i = 0; i < length; i++) {
    const char ch = input[i];
    if (ch != '%' && is_forbidden_host_codepoint(ch)) {
      return;
    } else {
      append_or_escape(&output, ch, VEIL_URL_C0_CONTROL_ENCODE_SET);
    }
  }

  veil_url_host_set_opaque(host, &output);
}

void veil_url_host_parse_host(veil_url_host* host, const char* input, size_t length, bool is_special, bool unicode) {
//  CHECK_EQ(type_, HostType::H_FAILED);
  const char* pointer = input;

  if (length == 0)
    return;

  if (pointer[0] == '[') {
    if (pointer[length - 1] != ']')
      return;
    return veil_url_host_parse_ipv6_host(host, ++pointer, length - 2);
  }

  if (!is_special)
    return veil_url_host_parse_opaque_host(host, input, length);

  // First, we have to percent decode
  cstr decoded = percent_decode(input, length);
  const char* decoded_str;
  size_t decoded_size;

  // Then we have to punycode toASCII
  // TODO: veil does not support i18n
  // if (!ToASCII(decoded, &decoded))
  //   return;

  decoded_str = cstr_str(&decoded);
  decoded_size = cstr_size(decoded);

  // If any of the following characters are still present, we have to fail
  for (size_t n = 0; n < decoded_size; n++) {
    if (is_forbidden_host_codepoint(decoded_str[n])) {
      cstr_drop(&decoded);
      return;
    }
  }

  // Check to see if it's an IPv4 IP address
  bool is_ipv4;
  veil_url_host_parse_ipv4_host(host, decoded_str, decoded_size, &is_ipv4);
  if (is_ipv4) {
    cstr_drop(&decoded);
    return;
  }

  // If the unicode flag is set, run the result through punycode ToUnicode
  // TODO: veil does not support i18n
  // if (unicode && !ToUnicode(decoded, &decoded))
  //   return;

  // It's not an IPv4 or IPv6 address, it must be a domain
  veil_url_host_set_domain(host, &decoded);
}

bool veil_url_host_parsing_failed(veil_url_host* host) {
  return host->type == URL_HOST_FAILED;
}

void url_parse(const char* input, size_t len, veil_url_parse_state state_override,
               veil_url_data* url, bool has_url, const veil_url_data* base, bool has_base) {
  const char* p = input;
  const char* end = input + len;
  cstr buffer = cstr_init();

  if (!has_url) {
    for (const char* ptr = p; ptr < end; ptr++) {
      if (IsC0ControlOrSpace(*ptr))
        p++;
      else
        break;
    }
    for (const char* ptr = end - 1; ptr >= p; ptr--) {
      if (IsC0ControlOrSpace(*ptr))
        end--;
      else
        break;
    }
    input = p;
    len = end - p;
  }

  // The spec says we should strip out any ASCII tabs or newlines.
  // In those cases, we create another std::string instance with the filtered
  // contents, but in the general case we avoid the overhead.
  cstr whitespace_stripped = cstr_init();

  for (const char* ptr = p; ptr < end; ptr++) {
    if (!IsASCIITabOrNewline(*ptr))
      continue;
    // Hit tab or newline. Allocate storage, copy what we have until now,
    // and then iterate and filter all similar characters out.
    cstr_reserve(&whitespace_stripped, len - 1);
    cstr_assign_n(&whitespace_stripped, p, ptr - p);

    // 'ptr + 1' skips the current char, which we know to be tab or newline.
    for (ptr = ptr + 1; ptr < end; ptr++) {
      if (!IsASCIITabOrNewline(*ptr))
        cstr_append_n(&whitespace_stripped, ptr, 1);
    }

    // Update variables like they should have looked like if the string
    // had been stripped of whitespace to begin with.
    input = cstr_str(&whitespace_stripped);
    len = cstr_size(whitespace_stripped);
    p = input;
    end = input + len;
    break;
  }

  if (cstr_empty(whitespace_stripped)) {
    goto EXIT;
  }

  bool atflag = false;  // Set when @ has been seen.
  bool square_bracket_flag = false;  // Set inside of [...]
  bool password_token_seen_flag = false;  // Set after a : after an username.
  // Set the initial parse state.
  const bool has_state_override = state_override != kUnknownState;
  veil_url_parse_state state = has_state_override ? state_override : kSchemeStart;

  if (state < kSchemeStart || state > kFragment) {
    url->flags |= URL_FLAGS_INVALID_PARSE_STATE;
    goto EXIT;
  }

  while (p <= end) {
    const char ch = p < end ? p[0] : kEOL;
    bool special = (url->flags & URL_FLAGS_SPECIAL);
    bool cannot_be_base;
    bool special_back_slash = (special && ch == '\\');

    switch (state) {
      case kSchemeStart:
        if (IsASCIIAlpha(ch)) {
          cstr_append_char(&buffer, ascii_lowercase(ch));
          state = kScheme;
        } else if (!has_state_override) {
          state = kNoScheme;
          continue;
        } else {
          url->flags |= URL_FLAGS_FAILED;
          goto EXIT;
        }
        break;
      case kScheme:
        if (IsASCIIAlphanumeric(ch) || ch == '+' || ch == '-' || ch == '.') {
          cstr_append_char(&buffer, ascii_lowercase(ch));
        } else if (ch == ':' || (has_state_override && ch == kEOL)) {
          if (has_state_override && cstr_empty(buffer)) {
            url->flags |= URL_FLAGS_TERMINATED;
            goto EXIT;
          }
          cstr_append_char(&buffer, ':');

          bool new_is_special = is_special(&buffer);

          if (has_state_override) {
            if ((special != new_is_special) ||
                ((cstr_eq_raw(&buffer, "file:")) &&
                 ((url->flags & URL_FLAGS_HAS_USERNAME) ||
                  (url->flags & URL_FLAGS_HAS_PASSWORD) ||
                  (url->port != -1))) ||
                (cstr_eq_raw(&url->scheme, "file:") && cstr_empty(url->host))) {
              url->flags |= URL_FLAGS_TERMINATED;
              goto EXIT;
            }
          }

          cstr_drop(&url->scheme);
          url->scheme = cstr_move(&buffer);
          url->port = normalize_port(&url->scheme, url->port);
          if (new_is_special) {
            url->flags |= URL_FLAGS_SPECIAL;
            special = true;
          } else {
            url->flags &= ~URL_FLAGS_SPECIAL;
            special = false;
          }
          // `special_back_slash` equals to `(special && ch == '\\')` and `ch`
          // here always not equals to `\\`. So `special_back_slash` here always
          // equals to `false`.
          special_back_slash = false;
          cstr_clear(&buffer);
          if (has_state_override)
            goto EXIT;
          if (cstr_eq_raw(&url->scheme, "file:")) {
            state = kFile;
          } else if (special &&
                     has_base &&
                     cstr_eq(&url->scheme, &base->scheme)) {
            state = kSpecialRelativeOrAuthority;
          } else if (special) {
            state = kSpecialAuthoritySlashes;
          } else if (p + 1 < end && p[1] == '/') {
            state = kPathOrAuthority;
            p++;
          } else {
            url->flags |= URL_FLAGS_CANNOT_BE_BASE;
            url->flags |= URL_FLAGS_HAS_PATH;
            cvec_str_emplace_back(&url->path, "");
            state = kCannotBeBase;
          }
        } else if (!has_state_override) {
          cstr_clear(&buffer);
          state = kNoScheme;
          p = input;
          continue;
        } else {
          url->flags |= URL_FLAGS_FAILED;
          goto EXIT;
        }
        break;
      case kNoScheme:
        cannot_be_base = has_base && (base->flags & URL_FLAGS_CANNOT_BE_BASE);
        if (!has_base || (cannot_be_base && ch != '#')) {
          url->flags |= URL_FLAGS_FAILED;
          goto EXIT;
        } else if (cannot_be_base && ch == '#') {
          url->scheme = base->scheme;
          if (is_special(&url->scheme)) {
            url->flags |= URL_FLAGS_SPECIAL;
            special = true;
          } else {
            url->flags &= ~URL_FLAGS_SPECIAL;
            special = false;
          }
          special_back_slash = (special && ch == '\\');
          if (base->flags & URL_FLAGS_HAS_PATH) {
            url->flags |= URL_FLAGS_HAS_PATH;
            url->path = base->path;
          }
          if (base->flags & URL_FLAGS_HAS_QUERY) {
            url->flags |= URL_FLAGS_HAS_QUERY;
            url->query = base->query;
          }
          if (base->flags & URL_FLAGS_HAS_FRAGMENT) {
            url->flags |= URL_FLAGS_HAS_FRAGMENT;
            url->fragment = base->fragment;
          }
          url->flags |= URL_FLAGS_CANNOT_BE_BASE;
          state = kFragment;
        } else if (has_base && !cstr_eq_raw(&base->scheme, "file:")) {
          state = kRelative;
          continue;
        } else {
          cstr_assign(&url->scheme, "file:");
          url->flags |= URL_FLAGS_SPECIAL;
          special = true;
          state = kFile;
          special_back_slash = (special && ch == '\\');
          continue;
        }
        break;
      case kSpecialRelativeOrAuthority:
        if (ch == '/' && p + 1 < end && p[1] == '/') {
          state = kSpecialAuthorityIgnoreSlashes;
          p++;
        } else {
          state = kRelative;
          continue;
        }
        break;
      case kPathOrAuthority:
        if (ch == '/') {
          state = kAuthority;
        } else {
          state = kPath;
          continue;
        }
        break;
      case kRelative:
        url->scheme = base->scheme;
        if (is_special(&url->scheme)) {
          url->flags |= URL_FLAGS_SPECIAL;
          special = true;
        } else {
          url->flags &= ~URL_FLAGS_SPECIAL;
          special = false;
        }
        special_back_slash = (special && ch == '\\');
        switch (ch) {
          case kEOL:
            if (base->flags & URL_FLAGS_HAS_USERNAME) {
              url->flags |= URL_FLAGS_HAS_USERNAME;
              url->username = base->username;
            }
            if (base->flags & URL_FLAGS_HAS_PASSWORD) {
              url->flags |= URL_FLAGS_HAS_PASSWORD;
              url->password = base->password;
            }
            if (base->flags & URL_FLAGS_HAS_HOST) {
              url->flags |= URL_FLAGS_HAS_HOST;
              url->host = base->host;
            }
            if (base->flags & URL_FLAGS_HAS_QUERY) {
              url->flags |= URL_FLAGS_HAS_QUERY;
              url->query = base->query;
            }
            if (base->flags & URL_FLAGS_HAS_PATH) {
              url->flags |= URL_FLAGS_HAS_PATH;
              url->path = base->path;
            }
            url->port = base->port;
            break;
          case '/':
            state = kRelativeSlash;
            break;
          case '?':
            if (base->flags & URL_FLAGS_HAS_USERNAME) {
              url->flags |= URL_FLAGS_HAS_USERNAME;
              url->username = base->username;
            }
            if (base->flags & URL_FLAGS_HAS_PASSWORD) {
              url->flags |= URL_FLAGS_HAS_PASSWORD;
              url->password = base->password;
            }
            if (base->flags & URL_FLAGS_HAS_HOST) {
              url->flags |= URL_FLAGS_HAS_HOST;
              url->host = base->host;
            }
            if (base->flags & URL_FLAGS_HAS_PATH) {
              url->flags |= URL_FLAGS_HAS_PATH;
              url->path = base->path;
            }
            url->port = base->port;
            state = kQuery;
            break;
          case '#':
            if (base->flags & URL_FLAGS_HAS_USERNAME) {
              url->flags |= URL_FLAGS_HAS_USERNAME;
              url->username = base->username;
            }
            if (base->flags & URL_FLAGS_HAS_PASSWORD) {
              url->flags |= URL_FLAGS_HAS_PASSWORD;
              url->password = base->password;
            }
            if (base->flags & URL_FLAGS_HAS_HOST) {
              url->flags |= URL_FLAGS_HAS_HOST;
              url->host = base->host;
            }
            if (base->flags & URL_FLAGS_HAS_QUERY) {
              url->flags |= URL_FLAGS_HAS_QUERY;
              url->query = base->query;
            }
            if (base->flags & URL_FLAGS_HAS_PATH) {
              url->flags |= URL_FLAGS_HAS_PATH;
              url->path = base->path;
            }
            url->port = base->port;
            state = kFragment;
            break;
          default:
            if (special_back_slash) {
              state = kRelativeSlash;
            } else {
              if (base->flags & URL_FLAGS_HAS_USERNAME) {
                url->flags |= URL_FLAGS_HAS_USERNAME;
                url->username = base->username;
              }
              if (base->flags & URL_FLAGS_HAS_PASSWORD) {
                url->flags |= URL_FLAGS_HAS_PASSWORD;
                url->password = base->password;
              }
              if (base->flags & URL_FLAGS_HAS_HOST) {
                url->flags |= URL_FLAGS_HAS_HOST;
                url->host = base->host;
              }
              if (base->flags & URL_FLAGS_HAS_PATH) {
                url->flags |= URL_FLAGS_HAS_PATH;
                url->path = base->path;
                shorten_url_path(url);
              }
              url->port = base->port;
              state = kPath;
              continue;
            }
        }
        break;
      case kRelativeSlash:
        if (is_special(&url->scheme) && (ch == '/' || ch == '\\')) {
          state = kSpecialAuthorityIgnoreSlashes;
        } else if (ch == '/') {
          state = kAuthority;
        } else {
          if (base->flags & URL_FLAGS_HAS_USERNAME) {
            url->flags |= URL_FLAGS_HAS_USERNAME;
            url->username = base->username;
          }
          if (base->flags & URL_FLAGS_HAS_PASSWORD) {
            url->flags |= URL_FLAGS_HAS_PASSWORD;
            url->password = base->password;
          }
          if (base->flags & URL_FLAGS_HAS_HOST) {
            url->flags |= URL_FLAGS_HAS_HOST;
            url->host = base->host;
          }
          url->port = base->port;
          state = kPath;
          continue;
        }
        break;
      case kSpecialAuthoritySlashes:
        state = kSpecialAuthorityIgnoreSlashes;
        if (ch == '/' && p + 1 < end && p[1] == '/') {
          p++;
        } else {
          continue;
        }
        break;
      case kSpecialAuthorityIgnoreSlashes:
        if (ch != '/' && ch != '\\') {
          state = kAuthority;
          continue;
        }
        break;
      case kAuthority:
        if (ch == '@') {
          if (atflag) {
            cstr_reserve(&buffer, cstr_size(buffer) + 3);
            cstr_insert(&buffer, 0, "%40");
          }
          atflag = true;
          size_t blen = cstr_size(buffer);
          if (blen > 0 && cstr_at(&buffer, 0) != ':') {
            url->flags |= URL_FLAGS_HAS_USERNAME;
          }
          for (size_t n = 0; n < blen; n++) {
            const char bch = cstr_at(&buffer, n);
            if (bch == ':') {
              url->flags |= URL_FLAGS_HAS_PASSWORD;
              if (!password_token_seen_flag) {
                password_token_seen_flag = true;
                continue;
              }
            }
            if (password_token_seen_flag) {
              append_or_escape(&url->password, bch, VEIL_URL_USERINFO_ENCODE_SET);
            } else {
              append_or_escape(&url->username, bch, VEIL_URL_USERINFO_ENCODE_SET);
            }
          }
          cstr_clear(&buffer);
        } else if (ch == kEOL ||
                   ch == '/' ||
                   ch == '?' ||
                   ch == '#' ||
                   special_back_slash) {
          if (atflag && cstr_empty(buffer)) {
            url->flags |= URL_FLAGS_FAILED;
            goto EXIT;
          }
          p -= cstr_size(buffer) + 1;
          cstr_clear(&buffer);
          state = kHost;
        } else {
          cstr_append_char(&buffer, ch);
        }
        break;
      case kHost:
      case kHostname:
        if (has_state_override && cstr_eq_raw(&url->scheme, "file:")) {
          state = kFileHost;
          continue;
        } else if (ch == ':' && !square_bracket_flag) {
          if (cstr_empty(buffer)) {
            url->flags |= URL_FLAGS_FAILED;
            goto EXIT;
          }
          if (state_override == kHostname) {
            goto EXIT;
          }
          url->flags |= URL_FLAGS_HAS_HOST;
          if (!parse_host(&buffer, &url->host, special, false)) {
            url->flags |= URL_FLAGS_FAILED;
            goto EXIT;
          }
          cstr_clear(&buffer);
          state = kPort;
        } else if (ch == kEOL ||
                   ch == '/' ||
                   ch == '?' ||
                   ch == '#' ||
                   special_back_slash) {
          p--;
          if (special && cstr_empty(buffer)) {
            url->flags |= URL_FLAGS_FAILED;
            goto EXIT;
          }
          if (has_state_override &&
              cstr_empty(buffer) &&
              ((cstr_size(url->username) > 0 || cstr_size(url->password) > 0) ||
               url->port != -1)) {
            url->flags |= URL_FLAGS_TERMINATED;
            goto EXIT;
          }
          url->flags |= URL_FLAGS_HAS_HOST;
          if (!parse_host(&buffer, &url->host, special, false)) {
            url->flags |= URL_FLAGS_FAILED;
            goto EXIT;
          }
          cstr_clear(&buffer);
          state = kPathStart;
          if (has_state_override) {
            goto EXIT;
          }
        } else {
          if (ch == '[')
            square_bracket_flag = true;
          if (ch == ']')
            square_bracket_flag = false;
          cstr_append_char(&buffer, ch);
        }
        break;
      case kPort:
        if (IsASCIIDigit(ch)) {
          cstr_append_char(&buffer, ch);
        } else if (has_state_override ||
                   ch == kEOL ||
                   ch == '/' ||
                   ch == '?' ||
                   ch == '#' ||
                   special_back_slash) {
          size_t buffer_size = cstr_size(buffer);
          if (buffer_size > 0) {
            unsigned port = 0;
            // the condition port <= 0xffff prevents integer overflow
            for (size_t i = 0; port <= 0xffff && i < buffer_size; i++)
              port = port * 10 + cstr_at(&buffer, i) - '0';
            if (port > 0xffff) {
              // TODO(TimothyGu): This hack is currently needed for the host
              // setter since it needs access to hostname if it is valid, and
              // if the FAILED flag is set the entire response to JS layer
              // will be empty.
              if (state_override == kHost)
                url->port = -1;
              else
                url->flags |= URL_FLAGS_FAILED;
              goto EXIT;
            }
            // the port is valid
            url->port = normalize_port(&url->scheme, (int)port);
            if (url->port == -1)
              url->flags |= URL_FLAGS_IS_DEFAULT_SCHEME_PORT;
            cstr_clear(&buffer);
          } else if (has_state_override) {
            // TODO(TimothyGu): Similar case as above.
            if (state_override == kHost)
              url->port = -1;
            else
              url->flags |= URL_FLAGS_TERMINATED;
            goto EXIT;
          }
          state = kPathStart;
          continue;
        } else {
          url->flags |= URL_FLAGS_FAILED;
          goto EXIT;
        }
        break;
      case kFile:
        cstr_assign(&url->scheme, "file:");
        cstr_clear(&url->host);
        url->flags |= URL_FLAGS_HAS_HOST;
        if (ch == '/' || ch == '\\') {
          state = kFileSlash;
        } else if (has_base && cstr_eq_raw(&base->scheme, "file:")) {
          switch (ch) {
            case kEOL:
              if (base->flags & URL_FLAGS_HAS_HOST) {
                url->host = base->host;
              }
              if (base->flags & URL_FLAGS_HAS_PATH) {
                url->flags |= URL_FLAGS_HAS_PATH;
                url->path = base->path;
              }
              if (base->flags & URL_FLAGS_HAS_QUERY) {
                url->flags |= URL_FLAGS_HAS_QUERY;
                url->query = base->query;
              }
              break;
            case '?':
              if (base->flags & URL_FLAGS_HAS_HOST) {
                url->host = base->host;
              }
              if (base->flags & URL_FLAGS_HAS_PATH) {
                url->flags |= URL_FLAGS_HAS_PATH;
                url->path = base->path;
              }
              url->flags |= URL_FLAGS_HAS_QUERY;
              cstr_clear(&url->query);
              state = kQuery;
              break;
            case '#':
              if (base->flags & URL_FLAGS_HAS_HOST) {
                url->host = base->host;
              }
              if (base->flags & URL_FLAGS_HAS_PATH) {
                url->flags |= URL_FLAGS_HAS_PATH;
                url->path = base->path;
              }
              if (base->flags & URL_FLAGS_HAS_QUERY) {
                url->flags |= URL_FLAGS_HAS_QUERY;
                url->query = base->query;
              }
              url->flags |= URL_FLAGS_HAS_FRAGMENT;
              cstr_clear(&url->fragment);
              state = kFragment;
              break;
            default:
              cstr_clear(&url->query);
              if (base->flags & URL_FLAGS_HAS_HOST) {
                url->host = base->host;
              }
              if (base->flags & URL_FLAGS_HAS_PATH) {
                url->flags |= URL_FLAGS_HAS_PATH;
                url->path = base->path;
              }
              if (!starts_with_windows_driver_letter(p, end)) {
                shorten_url_path(url);
              } else {
                cvec_str_clear(&url->path);
              }
              state = kPath;
              continue;
          }
        } else {
          state = kPath;
          continue;
        }
        break;
      case kFileSlash:
        if (ch == '/' || ch == '\\') {
          state = kFileHost;
        } else {
          if (has_base && cstr_eq_raw(&base->scheme, "file:")) {
            url->flags |= URL_FLAGS_HAS_HOST;
            url->host = base->host;
            if (!starts_with_windows_driver_letter(p, end) &&
                is_normalized_windows_drive_letter(cvec_str_at(&base->path, 0))) {
              url->flags |= URL_FLAGS_HAS_PATH;
              cvec_str_push_back(&url->path, cstr_clone(*cvec_str_at(&base->path, 0)));
            }
          }
          state = kPath;
          continue;
        }
        break;
      case kFileHost:
        if (ch == kEOL ||
            ch == '/' ||
            ch == '\\' ||
            ch == '?' ||
            ch == '#') {
          if (!has_state_override && cstr_size(buffer) == 2
                && is_windows_drive_letter(cstr_at(&buffer, 0), cstr_at(&buffer, 1))) {
            state = kPath;
          } else if (cstr_empty(buffer)) {
            url->flags |= URL_FLAGS_HAS_HOST;
            cstr_clear(&url->host);
            if (has_state_override)
              goto EXIT;
            state = kPathStart;
          } else {
            cstr host = cstr_init();
            if (!parse_host(&buffer, &host, special, false)) {
              url->flags |= URL_FLAGS_FAILED;
              goto EXIT;
            }
            if (cstr_eq_raw(&host, "localhost"))
              cstr_clear(&host);
            url->flags |= URL_FLAGS_HAS_HOST;
            url->host = host;
            if (has_state_override)
              goto EXIT;
            cstr_clear(&buffer);
            state = kPathStart;
          }
          continue;
        } else {
          cstr_append_char(&buffer, ch);
        }
        break;
      case kPathStart:
        if (is_special(&url->scheme)) {
          state = kPath;
          if (ch != '/' && ch != '\\') {
            continue;
          }
        } else if (!has_state_override && ch == '?') {
          url->flags |= URL_FLAGS_HAS_QUERY;
          cstr_clear(&url->query);
          state = kQuery;
        } else if (!has_state_override && ch == '#') {
          url->flags |= URL_FLAGS_HAS_FRAGMENT;
          cstr_clear(&url->fragment);
          state = kFragment;
        } else if (ch != kEOL) {
          state = kPath;
          if (ch != '/') {
            continue;
          }
        } else if (has_state_override && !(url->flags & URL_FLAGS_HAS_HOST)) {
          url->flags |= URL_FLAGS_HAS_PATH;
          cvec_str_emplace_back(&url->path, "");
        }
        break;
      case kPath:
        if (ch == kEOL ||
            ch == '/' ||
            special_back_slash ||
            (!has_state_override && (ch == '?' || ch == '#'))) {
          if (is_double_dot_segment(&buffer)) {
            shorten_url_path(url);
            if (ch != '/' && !special_back_slash) {
              url->flags |= URL_FLAGS_HAS_PATH;
              cvec_str_emplace_back(&url->path, "");
            }
          } else if (is_single_dot_segment(&buffer) &&
                     ch != '/' && !special_back_slash) {
            url->flags |= URL_FLAGS_HAS_PATH;
            cvec_str_emplace_back(&url->path, "");
          } else if (!is_single_dot_segment(&buffer)) {
            if (cstr_eq_raw(&url->scheme, "file:") &&
                cvec_str_empty(url->path) &&
                cstr_size(buffer) == 2 &&
                is_windows_drive_letter(cstr_at(&buffer, 0), cstr_at(&buffer, 1))) {
              cstr_data(&buffer)[1] = ':';
            }
            url->flags |= URL_FLAGS_HAS_PATH;
            cvec_str_push_back(&url->path, cstr_move(&buffer));
          }
          cstr_clear(&buffer);
          if (ch == '?') {
            url->flags |= URL_FLAGS_HAS_QUERY;
            cstr_clear(&url->query);
            state = kQuery;
          } else if (ch == '#') {
            url->flags |= URL_FLAGS_HAS_FRAGMENT;
            cstr_clear(&url->fragment);
            state = kFragment;
          }
        } else {
          append_or_escape(&buffer, ch, VEIL_URL_PATH_ENCODE_SET);
        }
        break;
      case kCannotBeBase:
        switch (ch) {
          case '?':
            state = kQuery;
            break;
          case '#':
            state = kFragment;
            break;
          default:
            if (cvec_str_empty(url->path))
              cvec_str_emplace_back(&url->path, "");
            else if (ch != kEOL)
              append_or_escape(cvec_str_at_mut(&url->path, 0), ch, VEIL_URL_C0_CONTROL_ENCODE_SET);
        }
        break;
      case kQuery:
        if (ch == kEOL || (!has_state_override && ch == '#')) {
          url->flags |= URL_FLAGS_HAS_QUERY;
          cstr_drop(&url->query);
          url->query = cstr_move(&buffer);
          cstr_clear(&buffer);
          if (ch == '#')
            state = kFragment;
        } else {
          append_or_escape(&buffer, ch, special ? VEIL_URL_QUERY_ENCODE_SET_SPECIAL :
                                                VEIL_URL_QUERY_ENCODE_SET_NONSPECIAL);
        }
        break;
      case kFragment:
        if (ch == kEOL) {
          url->flags |= URL_FLAGS_HAS_FRAGMENT;
          cstr_drop(&url->fragment);
          url->fragment = cstr_move(&buffer);
        } else {
          append_or_escape(&buffer, ch, VEIL_URL_FRAGMENT_ENCODE_SET);
        }
        break;
      default:
        url->flags |= URL_FLAGS_INVALID_PARSE_STATE;
        goto EXIT;
    }

    p++;
  }

EXIT:
  cstr_drop(&buffer);
  cstr_drop(&whitespace_stripped);
}

static bool bit_at(const uint8_t a[], const uint8_t i) {
  return !!(a[i >> 3] & (1 << (i & 7)));
}

// Appends ch to str. If ch position in encode_set is set, the ch will
// be percent-encoded then appended.
static void append_or_escape(cstr* str, const unsigned char ch, const uint8_t encode_set[]) {
  if (bit_at(encode_set, ch)) {
    cstr_append(str, VEIL_URL_HEX + ch * 4); // "%XX\0" has a length of 4
  } else {
    cstr_append_char(str, (char)ch);
  }
}

// https://infra.spec.whatwg.org/#ascii-lowercase
static char ascii_lowercase(char ch) {
  return IsASCIIAlpha(ch) ? (ch | 0x20) : ch;
}

static uint32_t hex_to_bin(char ch) {
  if (ch >= '0' && ch <= '9')
    return ch - '0';
  if (ch >= 'A' && ch <= 'F')
    return 10 + (ch - 'A');
  if (ch >= 'a' && ch <= 'f')
    return 10 + (ch - 'a');
//  UNREACHABLE();
  return 0;
}

static cstr percent_decode(const char* input, size_t len) {
  if (len == 0)
    return cstr_init();

  cstr dest = cstr_with_capacity(len);
  const char* pointer = input;
  const char* end = input + len;

  while (pointer < end) {
    const char ch = pointer[0];
    size_t remaining = end - pointer - 1;
    if (ch != '%' || remaining < 2 ||
        (ch == '%' &&
         (!IsASCIIHexDigit(pointer[1]) ||
          !IsASCIIHexDigit(pointer[2])))) {
      cstr_append_n(&dest, (const char*)&ch, 1);
      pointer++;
      continue;
    } else {
      uint32_t a = hex_to_bin(pointer[1]);
      uint32_t b = hex_to_bin(pointer[2]);
      char c = (char)(a * 16 + b);
      cstr_append_n(&dest, (const char*)&c, 1);
      pointer += 3;
    }
  }

  return dest;
}

static bool parse_host(const cstr* input, cstr* output, bool is_special, bool unicode) {
  if (cstr_empty(*input)) {
    cstr_clear(output);
    return true;
  }

  veil_url_host host = veil_url_host_init();
  bool result;

  veil_url_host_parse_host(&host, cstr_str(input), cstr_size(*input), is_special, unicode);
  result = !veil_url_host_parsing_failed(&host);

  if (result) {
    cstr_assign(output, veil_url_host_to_string(&host));
  }

  veil_url_host_drop(&host);

  return result;
}

static int64_t parse_number(const char* start, const char* end) {
  int32_t R = 10;
  if (end - start >= 2 && start[0] == '0' && (start[1] | 0x20) == 'x') {
    start += 2;
    R = 16;
  }
  if (end - start == 0) {
    return 0;
  } else if (R == 10 && end - start > 1 && start[0] == '0') {
    start++;
    R = 8;
  }
  const char* p = start;

  while (p < end) {
    const char ch = p[0];
    switch (R) {
      case 8:
        if (ch < '0' || ch > '7')
          return -1;
        break;
      case 10:
        if (!IsASCIIDigit(ch))
          return -1;
        break;
      case 16:
        if (!IsASCIIHexDigit(ch))
          return -1;
        break;
      default:
        return -1;
    }
    p++;
  }
  return strtoll(start, NULL, R);
}

#define SPECIALS(XX)                                                          \
  XX(ftp, 21, "ftp:")                                                         \
  XX(file, -1, "file:")                                                       \
  XX(http, 80, "http:")                                                       \
  XX(https, 443, "https:")                                                    \
  XX(ws, 80, "ws:")                                                           \
  XX(wss, 443, "wss:")

static bool is_special(cstr* scheme) {
#define V(_, __, name) if (cstr_eq_raw(scheme, name)) return true;
  SPECIALS(V);
#undef V
  return false;
}

static jerry_value_t get_special(const cstr* scheme) {
#define V(key, _, name) if (cstr_eq_raw(scheme, name))                                  \
    return jerry_string_sz(name);
  SPECIALS(V)
#undef V
  return jerry_throw_sz(JERRY_ERROR_TYPE, "invalid scheme");
}

static int normalize_port(cstr* scheme, int p) {
#define V(_, port, name) if (cstr_eq_raw(scheme, name) && p == port) return -1;
  SPECIALS(V);
#undef V
  return p;
}

// https://url.spec.whatwg.org/#windows-drive-letter
static bool is_windows_drive_letter(char ch1, char ch2) {
  return (IsASCIIAlpha(ch1) && (ch2 == ':' || ch2 == '|'));
}

// https://url.spec.whatwg.org/#normalized-windows-drive-letter
static bool is_normalized_windows_drive_letter(const cstr* str) {
  if (cstr_size(*str) < 2) {
    return false;
  }

  return (IsASCIIAlpha(cstr_at(str, 0)) && cstr_at(str, 1) == ':');
}

// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
static bool starts_with_windows_driver_letter(const char* p, const char* end) {
  size_t length = end - p;
  return length >= 2 &&
         is_windows_drive_letter(p[0], p[1]) &&
         (length == 2 ||
          p[2] == '/' ||
          p[2] == '\\' ||
          p[2] == '?' ||
          p[2] == '#');
}

// Single dot segment can be ".", "%2e", or "%2E"
static bool is_single_dot_segment(cstr* str) {
  switch (cstr_size(*str)) {
    case 1:
      return cstr_eq_raw(str, ".");
    case 3:
      return cstr_at(str, 0) == '%' &&
             cstr_at(str, 1) == '2' &&
             ascii_lowercase(cstr_at(str, 2)) == 'e';
    default:
      return false;
  }
}

// Double dot segment can be:
//   "..", ".%2e", ".%2E", "%2e.", "%2E.",
//   "%2e%2e", "%2E%2E", "%2e%2E", or "%2E%2e"
static bool is_double_dot_segment(cstr* str) {
  switch (cstr_size(*str)) {
    case 2:
      return cstr_eq_raw(str, "..");
    case 4:
      if (cstr_at(str, 0) != '.' && cstr_at(str, 0) != '%')
        return false;
      return ((cstr_at(str, 0) == '.' &&
               cstr_at(str, 1) == '%' &&
               cstr_at(str, 2) == '2' &&
               ascii_lowercase(cstr_at(str, 3)) == 'e') ||
               (cstr_at(str, 0)== '%' &&
               cstr_at(str, 1) == '2' &&
               ascii_lowercase(cstr_at(str, 2)) == 'e' &&
               cstr_at(str, 3) == '.'));
    case 6:
      return (cstr_at(str, 0) == '%' &&
              cstr_at(str, 1) == '2' &&
              ascii_lowercase(cstr_at(str, 2)) == 'e' &&
              cstr_at(str, 3) == '%' &&
              cstr_at(str, 4) == '2' &&
              ascii_lowercase(cstr_at(str, 5)) == 'e');
    default:
      return false;
  }
}

static void shorten_url_path(veil_url_data* url) {
  if (cvec_str_empty(url->path)) {
    return;
  }

  if (cvec_str_size(url->path) == 1 && cstr_eq_raw(&url->scheme, "file:")
      && is_normalized_windows_drive_letter(cvec_str_at(&url->path, 0))) {
    return;
  }

  cvec_str_pop_back(&url->path);
}

static int32_t set_cstr(cstr* str, jerry_value_t obj, const char* property, int32_t flags, bool empty_as_present) {
  jerry_value_t value = iotjs_jval_get_property(obj, property);
  int32_t result;

  if (jerry_value_is_string(value)) {
    cstr_drop(str);
    *str = iotjs_jval_as_cstr(value);

    if (empty_as_present || !cstr_empty(*str)) {
      result = flags;
    } else {
      result = 0;
    }
  } else {
    result = 0;
  }

  jerry_value_free(value);

  return result;
}

static int32_t get_port(jerry_value_t value) {
  jerry_value_t port_value = iotjs_jval_get_property(value, "port");
  int32_t port;

  if (jerry_value_is_string(port_value) || jerry_value_is_number(port_value)) {
    jerry_value_t port_number = jerry_value_to_number(port_value);

    port = jerry_value_as_int32(port_number);

    jerry_value_free(port_number);
  } else {
    port = -1;
  }

  jerry_value_free(port_value);

  return port;
}

static int32_t set_path(cvec_str* path, jerry_value_t value, int32_t flags) {
  jerry_value_t path_value = iotjs_jval_get_property(value, "path");
  int32_t result;

  if (jerry_value_is_array(path_value)) {
    jerry_length_t length = jerry_array_length(path_value);

    for (jerry_length_t i = 0; i < length; i++) {
      jerry_value_t item = jerry_object_get_index(path_value, i);

      if (jerry_value_is_string(item)) {
        cvec_str_push(path, iotjs_jval_as_cstr(item));
      }

      jerry_value_free(item);
    }

    result = flags;
  } else {
    result = 0;
  }

  jerry_value_free(path_value);

  return result;
}

static bool harvest_base(jerry_value_t base_obj, veil_url_data* base) {
  if (!jerry_value_is_object(base_obj)) {
    return false;
  }

  // flags
  base->flags = iotjs_jval_get_property_as_int32(base_obj, "flags", 0);
  // port
  base->port = get_port(base_obj);
  // scheme
  base->flags |= set_cstr(&base->scheme, base_obj, "scheme", 0, false);
  // username
  base->flags |= set_cstr(&base->username, base_obj, "username", URL_FLAGS_HAS_USERNAME, false);
  // password
  base->flags |= set_cstr(&base->password, base_obj, "password", URL_FLAGS_HAS_PASSWORD, false);
  // host
  base->flags |= set_cstr(&base->host, base_obj, "host", URL_FLAGS_HAS_HOST, true);
  // query
  base->flags |= set_cstr(&base->query, base_obj, "query", URL_FLAGS_HAS_QUERY, true);
  // fragment
  base->flags |= set_cstr(&base->fragment, base_obj, "fragment", URL_FLAGS_HAS_FRAGMENT, true);
  // path
  base->flags |= set_path(&base->path, base_obj, URL_FLAGS_HAS_PATH);

  return true;
}

static bool harvest_context(jerry_value_t context_obj, veil_url_data* context) {
  if (!jerry_value_is_object(context_obj)) {
    return false;
  }

  int32_t flags_from_obj = iotjs_jval_get_property_as_int32(context_obj, "flags", 0);

  if (flags_from_obj != 0) {
    context->flags |= (flags_from_obj | URL_FLAGS_SPECIAL | URL_FLAGS_CANNOT_BE_BASE |
      URL_FLAGS_HAS_USERNAME | URL_FLAGS_HAS_PASSWORD | URL_FLAGS_HAS_HOST);
  }

  // scheme
  set_cstr(&context->scheme, context_obj, "scheme", 0, false);
  // port
  context->port = get_port(context_obj);
  // username
  if (context->flags & URL_FLAGS_HAS_USERNAME) {
    set_cstr(&context->username, context_obj, "username", 0, false);
  }
  // password
  if (context->flags & URL_FLAGS_HAS_PASSWORD) {
    set_cstr(&context->password, context_obj, "password", 0, false);
  }
  // host
  set_cstr(&context->host, context_obj, "host", 0, false);

  return true;
}

JS_FUNCTION(js_domain_to) {
  DJS_CHECK_ARGS(2, string, boolean);
  cstr input = JS_GET_ARG(0, cstr);
  bool unicode = JS_GET_ARG(1, boolean);
  veil_url_host host = veil_url_host_init();
  jerry_value_t result;

  if (!cstr_empty(input)) {
    veil_url_host_parse_host(&host, cstr_str(&input), cstr_size(input), true, unicode);
  }

  result = jerry_string_sz(veil_url_host_to_string(&host));

  veil_url_host_drop(&host);
  cstr_drop(&input);

  return result;
}

JS_FUNCTION(js_encode_auth) {
  DJS_CHECK_ARGS(1, string);
  cstr input = JS_GET_ARG(0, cstr);
  const char* input_s = cstr_str_safe(&input);
  cstr output = cstr_with_capacity(cstr_size(input));

  while (*input_s) {
    append_or_escape(&output, *input_s++, VEIL_URL_USERINFO_ENCODE_SET);
  }

  jerry_value_t result = jerry_string_sz(cstr_str_safe(&output));

  cstr_drop(&input);
  cstr_drop(&output);

  return result;
}

JS_FUNCTION(js_parse) {
  JS_CHECK(jargc >= 6);

  cstr input = JS_GET_ARG(0, cstr);
  int32_t state_override = jerry_value_as_int32(jargv[1]);
  veil_url_data base_context = veil_url_data_init();
  bool has_base_context;
  veil_url_data url = veil_url_data_init();
  bool has_url;
  jerry_value_t complete_callback = jargv[4];
  jerry_value_t error_callback = jargv[5];
  size_t i;

  switch (state_override) {
#define XX(name) case name:
    GEN_VEIL_URL_PARSE_STATES(XX)
#undef XX
      break;
    default:
      state_override = kUnknownState;
      break;
  }

  has_base_context = harvest_base(jargv[2], &base_context);
  has_url = harvest_context(jargv[3], &url);

  url_parse(
      cstr_str_safe(&input),
      cstr_size(input),
      state_override,
      &url,
      has_url,
      &base_context,
      has_base_context);

  if ((url.flags & URL_FLAGS_INVALID_PARSE_STATE)
      || ((state_override != kUnknownState) && (url.flags & URL_FLAGS_TERMINATED))) {
    goto EXIT;
  }

  if (!(url.flags & URL_FLAGS_FAILED)) {
    jerry_value_t argv[ARG_COUNT];

    argv[ARG_FLAGS] = jerry_number(url.flags);

    argv[ARG_PROTOCOL] = (url.flags & URL_FLAGS_SPECIAL) ?
      get_special(&url.scheme) : jerry_string_sz(cstr_str_safe(&url.scheme));

    argv[ARG_USERNAME] = (url.flags & URL_FLAGS_HAS_USERNAME) ?
      jerry_string_sz(cstr_str_safe(&url.username)) : jerry_undefined();

    argv[ARG_PASSWORD] = (url.flags & URL_FLAGS_HAS_PASSWORD) ?
      jerry_string_sz(cstr_str_safe(&url.password)) : jerry_undefined();

    // host defaults to null
    argv[ARG_HOST] = (url.flags & URL_FLAGS_HAS_HOST) ?
      jerry_string_sz(cstr_str_safe(&url.host)) : jerry_null();

    // query defaults to null
    argv[ARG_QUERY] = (url.flags & URL_FLAGS_HAS_QUERY) ?
      jerry_string_sz(cstr_str_safe(&url.query)) : jerry_null();

    // fragment defaults to null
    argv[ARG_FRAGMENT] = (url.flags & URL_FLAGS_HAS_FRAGMENT) ?
      jerry_string_sz(cstr_str_safe(&url.fragment)) : jerry_null();

    // port defaults to null
    argv[ARG_PORT] = (url.port > -1) ? jerry_number(url.port) : jerry_null();

    if (url.flags & URL_FLAGS_HAS_PATH) {
      size_t length = cvec_str_size(url.path);
      jerry_value_t path_array = jerry_array_length(length);

      for (i = 0; i < length; i++) {
        const char* p = cstr_str_safe(cvec_str_at(&url.path, i));
        iotjs_jval_set_property_by_index(path_array, (uint32_t)i, jerry_string_sz(p));
      }

      argv[ARG_PATH] = path_array;
    } else {
      argv[ARG_PATH] = jerry_undefined();
    }

    jerry_value_t result = jerry_call(complete_callback, call_info_p->this_value, argv, ARG_COUNT);

    for (i = 0; i < ARG_COUNT; i++) {
      jerry_value_free(argv[i]);
    }

    jerry_value_free(result);
  } else if (jerry_value_is_function(error_callback)) {
    jerry_value_t flags = jerry_number(url.flags);
    jerry_value_t result = jerry_call(error_callback, call_info_p->this_value, &flags, 1);

    jerry_value_free(flags);
    jerry_value_free(result);
  }

EXIT:
  cstr_drop(&input);

  veil_url_data_drop(&url);
  veil_url_data_drop(&base_context);

  return jerry_undefined();
}

jerry_value_t veil_init_url(void) {
  jerry_value_t url = jerry_object();

  iotjs_jval_set_method(url, "domainTo", js_domain_to);
  iotjs_jval_set_method(url, "encodeAuth", js_encode_auth);
  iotjs_jval_set_method(url, "parse", js_parse);

#define XX(name, _) VEIL_DEFINE_CONSTANT(url, name);
  GEN_VEIL_URL_FLAGS(XX)
#undef XX

#define XX(name) VEIL_DEFINE_CONSTANT(url, name);
  GEN_VEIL_URL_PARSE_STATES(XX)
#undef XX

  return url;
}
