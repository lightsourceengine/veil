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

#include "veil_module_buffer.h"
#include "veil_uv_request.h"

#define MS_PER_SEC 1000
#define NS_PER_MS 1000000
#define NS_PER_SEC 1000000000

typedef int32_t fs_extra_type_t;

static jerry_value_t make_stat_object(uv_stat_t* statbuf, bool use_bigint);


static jerry_value_t veil_create_uv_exception(int errorno,
                                               const char* syscall) {
  static char msg[256];
  snprintf(msg, sizeof(msg), "'%s' %s", syscall, uv_strerror(errorno));
  return iotjs_jval_create_error_without_error_flag(msg);
}


static void fs_after_async(uv_fs_t* req) {
  const jerry_value_t cb = *VEIL_UV_REQUEST_JSCALLBACK(req);
  IOTJS_ASSERT(jerry_value_is_function(cb));

  jerry_value_t jargs[2] = { jerry_undefined(), jerry_undefined() };
  size_t jargc = 0;
  if (req->result < 0) {
    jerry_value_t jerror = veil_create_uv_exception((int32_t)req->result, "open");
    jargs[jargc++] = jerror;
  } else {
    jargs[jargc++] = jerry_null();
    switch (req->fs_type) {
      case UV_FS_SYMLINK:
      case UV_FS_CLOSE: {
        break;
      }
      case UV_FS_OPEN:
      case UV_FS_READ:
      case UV_FS_WRITE: {
        jargs[jargc++] = jerry_number((double)req->result);
        break;
      }
      case UV_FS_SCANDIR: {
        int r;
        uv_dirent_t ent;
        uint32_t idx = 0;
        jargs[jargc++] = jerry_array(0);
        while ((r = uv_fs_scandir_next(req, &ent)) != UV_EOF) {
          jerry_value_t name = jerry_string_sz(ent.name);
          iotjs_jval_set_property_by_index(jargs[1], idx, name);
          jerry_value_free(name);
          idx++;
        }
        break;
      }
      case UV_FS_FSTAT:
      case UV_FS_LSTAT:
      case UV_FS_STAT: {
        fs_extra_type_t use_bigint = *((fs_extra_type_t*)VEIL_UV_REQUEST_EXTRA_DATA(req));
        jargs[jargc++] = make_stat_object(&req->statbuf, use_bigint);
        break;
      }
      case UV_FS_READLINK:
      case UV_FS_REALPATH:
        jargs[jargc++] = jerry_string_sz(req->ptr);
        break;
      default: { break; }
    }
  }

  iotjs_invoke_callback(cb, jerry_undefined(), jargs, jargc);

  jerry_value_free(jargs[0]);
  jerry_value_free(jargs[1]);
  uv_fs_req_cleanup(req);
  veil_uv_request_destroy((uv_req_t*)req);
}


static jerry_value_t fs_after_sync(uv_fs_t* req, int err,
                                   const char* syscall_name) {
  if (err < 0) {
    jerry_value_t jvalue = veil_create_uv_exception(err, syscall_name);
    jerry_value_t jerror = jerry_throw_value(jvalue, true);
    return jerror;
  }

  switch (req->fs_type) {
    case UV_FS_OPEN:
    case UV_FS_READ:
    case UV_FS_WRITE:
      return jerry_number(err);
    case UV_FS_FSTAT:
    case UV_FS_LSTAT:
    case UV_FS_STAT: {
      fs_extra_type_t use_bigint = *((fs_extra_type_t*)VEIL_UV_REQUEST_EXTRA_DATA(req));
      return make_stat_object(&req->statbuf, use_bigint);
    }
    case UV_FS_READLINK:
    case UV_FS_REALPATH:
      return jerry_string_sz(req->ptr);
    case UV_FS_SCANDIR: {
      int r;
      uv_dirent_t ent;
      uint32_t idx = 0;
      jerry_value_t ret = jerry_array(0);
      while ((r = uv_fs_scandir_next(req, &ent)) != UV_EOF) {
        jerry_value_t name = jerry_string_sz(ent.name);
        iotjs_jval_set_property_by_index(ret, idx, name);
        jerry_value_free(name);
        idx++;
      }
      return ret;
    }
    case UV_FS_CLOSE:
    case UV_FS_MKDIR:
    case UV_FS_RMDIR:
    case UV_FS_UNLINK:
    case UV_FS_RENAME:
    case UV_FS_SYMLINK:
      return jerry_undefined();
    default: {
      IOTJS_ASSERT(false);
      return jerry_undefined();
    }
  }
}


static inline bool is_within_bounds(size_t off, size_t len, size_t max) {
  if (off >= max || max - off < len)
    return false;

  return true;
}

static uv_fs_t* create_fs_request(jerry_value_t callback, fs_extra_type_t extra_data) {
  uv_fs_t* req = (uv_fs_t*)veil_uv_request_create(
      sizeof(uv_fs_t), callback, sizeof(fs_extra_type_t));

  *((fs_extra_type_t*)VEIL_UV_REQUEST_EXTRA_DATA(req)) = extra_data;

  return req;
}

static uv_fs_t* create_fs_request_sync(fs_extra_type_t extra_data) {
  uv_fs_t* req = (uv_fs_t*)veil_uv_request_create_sync(sizeof(uv_fs_t), sizeof(fs_extra_type_t));

  *((fs_extra_type_t*)VEIL_UV_REQUEST_EXTRA_DATA(req)) = extra_data;

  return req;
}

#define FS_ASYNC_EXTRA(env, extra_data, syscall, pcallback, ...)              \
  uv_fs_t* fs_req = create_fs_request(pcallback, extra_data);                 \
  *((fs_extra_type_t*)VEIL_UV_REQUEST_EXTRA_DATA(fs_req)) = extra_data;       \
  int err = uv_fs_##syscall(iotjs_environment_loop(env), fs_req, __VA_ARGS__, \
                            fs_after_async);                                  \
  if (err < 0) {                                                              \
    fs_req->result = err;                                                     \
    fs_after_async(fs_req);                                                   \
  }                                                                           \
  ret_value = jerry_null();

#define FS_ASYNC(env, syscall, pcallback, ...)                                \
  FS_ASYNC_EXTRA(env, 0, syscall, pcallback, __VA_ARGS__)

#define FS_SYNC_EXTRA(env, extra_data, syscall, ...)                          \
  uv_fs_t* fs_req = create_fs_request_sync(extra_data);                       \
  int err = uv_fs_##syscall(iotjs_environment_loop(env), fs_req, __VA_ARGS__, \
                            NULL);                                            \
  ret_value = fs_after_sync(fs_req, err, #syscall);                           \
  uv_fs_req_cleanup(fs_req);                                                  \
  veil_uv_request_destroy((uv_req_t*)fs_req);

#define FS_SYNC(env, syscall, ...) FS_SYNC_EXTRA(env, 0, syscall, __VA_ARGS__)

JS_FUNCTION(fs_close) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(1, number);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  int fd = JS_GET_ARG(0, number);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(1, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, close, jcallback, fd);
  } else {
    FS_SYNC(env, close, fd);
  }
  return ret_value;
}


JS_FUNCTION(fs_open) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(3, string, number, number);
  DJS_CHECK_ARG_IF_EXIST(3, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  int flags = JS_GET_ARG(1, number);
  int mode = JS_GET_ARG(2, number);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(3, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, open, jcallback, cstr_str_safe(&path), flags, mode);
  } else {
    FS_SYNC(env, open, cstr_str_safe(&path), flags, mode);
  }

  cstr_drop(&path);
  return ret_value;
}


typedef enum { IOTJS_FS_READ, IOTJS_FS_WRITE } iotjs_fs_op_t;

jerry_value_t fs_do_read_or_write(const jerry_call_info_t *call_info_p,
                                  const jerry_value_t jargv[],
                                  const jerry_length_t jargc,
                                  const iotjs_fs_op_t fs_op) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(5, number, object, number, number, number);
  DJS_CHECK_ARG_IF_EXIST(5, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  int fd = JS_GET_ARG(0, number);
  const jerry_value_t jbuffer = JS_GET_ARG(1, object);
  size_t offset = JS_GET_ARG(2, number);
  size_t length = JS_GET_ARG(3, number);
  int position = JS_GET_ARG(4, number);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(5, function);

  iotjs_bufferwrap_t* buffer_wrap = iotjs_bufferwrap_from_jbuffer(jbuffer);
  char* data = buffer_wrap->buffer;
  size_t data_length = iotjs_bufferwrap_length(buffer_wrap);
  DJS_CHECK(data != NULL && data_length > 0);

  if (!is_within_bounds(offset, length, data_length)) {
    return JS_CREATE_ERROR(RANGE, "length out of bound");
  }

  uv_buf_t uvbuf = uv_buf_init(data + offset, length);

  jerry_value_t ret_value;
  if (fs_op == IOTJS_FS_READ) {
    if (!jerry_value_is_null(jcallback)) {
      FS_ASYNC(env, read, jcallback, fd, &uvbuf, 1, position);
    } else {
      FS_SYNC(env, read, fd, &uvbuf, 1, position);
    }
  } else {
    if (!jerry_value_is_null(jcallback)) {
      FS_ASYNC(env, write, jcallback, fd, &uvbuf, 1, position);
    } else {
      FS_SYNC(env, write, fd, &uvbuf, 1, position);
    }
  }
  return ret_value;
}


JS_FUNCTION(fs_read) {
  return fs_do_read_or_write(call_info_p, jargv, jargc, IOTJS_FS_READ);
}


JS_FUNCTION(fs_write) {
  return fs_do_read_or_write(call_info_p, jargv, jargc, IOTJS_FS_WRITE);
}

static void set_by_index(jerry_value_t array, uint32_t index, uint64_t value, bool use_bigint) {
  jerry_value_t set = use_bigint ? jerry_bigint(&value, 1, false) : jerry_number(value);

  iotjs_jval_set_property_by_index(array, index, set);

  jerry_value_free(set);
}

static void set_timespec_by_index(jerry_value_t array, uint32_t index, uv_timespec_t* timespec, bool use_bigint) {
  jerry_value_t set;
  uint64_t value;

  if (use_bigint) {
    value = timespec->tv_sec * NS_PER_SEC + timespec->tv_nsec;
    set = jerry_bigint(&value, 1, false);
  } else {
    value = timespec->tv_sec * MS_PER_SEC + timespec->tv_nsec / NS_PER_MS;
    set = jerry_number(value);
  }

  iotjs_jval_set_property_by_index(array, index, set);

  jerry_value_free(set);
}

static jerry_value_t make_stat_object(uv_stat_t* statbuf, bool use_bigint) {
  iotjs_environment_t* env = iotjs_environment_get();
  jerry_value_t stats_constructor = veil_env_get_class(
      env, use_bigint ? VEIL_ENV_CLASS_BIG_INT_STATS : VEIL_ENV_CLASS_STATS);
  jerry_value_t stats = jerry_construct(stats_constructor, NULL, 0);
  uint32_t i = 0;

  set_by_index(stats, i++, statbuf->st_dev, use_bigint);
  set_by_index(stats, i++, statbuf->st_ino, use_bigint);
  set_by_index(stats, i++, statbuf->st_mode, use_bigint);
  set_by_index(stats, i++, statbuf->st_nlink, use_bigint);
  set_by_index(stats, i++, statbuf->st_uid, use_bigint);
  set_by_index(stats, i++, statbuf->st_gid, use_bigint);
  set_by_index(stats, i++, statbuf->st_rdev, use_bigint);
  set_by_index(stats, i++, statbuf->st_size, use_bigint);
  set_by_index(stats, i++, statbuf->st_blksize, use_bigint);
  set_by_index(stats, i++, statbuf->st_blocks, use_bigint);

  set_timespec_by_index(stats, i++, &statbuf->st_atim, use_bigint);
  set_timespec_by_index(stats, i++, &statbuf->st_mtim, use_bigint);
  set_timespec_by_index(stats, i++, &statbuf->st_ctim, use_bigint);
  set_timespec_by_index(stats, i, &statbuf->st_birthtim, use_bigint);

  jerry_value_free(stats_constructor);

  return stats;
}


JS_FUNCTION(fs_stat) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(2, string, boolean);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  bool use_bigint = JS_GET_ARG(1, boolean);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(2, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC_EXTRA(env, use_bigint, stat, jcallback, cstr_str_safe(&path));
  } else {
    FS_SYNC_EXTRA(env, use_bigint, stat, cstr_str_safe(&path));
  }

  cstr_drop(&path);
  return ret_value;
}


JS_FUNCTION(fs_lstat) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(2, string, boolean);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  bool use_bigint = JS_GET_ARG(1, boolean);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(2, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC_EXTRA(env, use_bigint, lstat, jcallback, cstr_str_safe(&path));
  } else {
    FS_SYNC_EXTRA(env, use_bigint, lstat, cstr_str_safe(&path));
  }

  cstr_drop(&path);
  return ret_value;
}


JS_FUNCTION(fs_fstat) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(2, number, boolean);
  DJS_CHECK_ARG_IF_EXIST(2, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  int32_t fd = JS_GET_ARG(0, number);
  bool use_bigint = JS_GET_ARG(1, boolean);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(2, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC_EXTRA(env, use_bigint, fstat, jcallback, fd);
  } else {
    FS_SYNC_EXTRA(env, use_bigint, fstat, fd);
  }
  return ret_value;
}


JS_FUNCTION(fs_mkdir) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(2, string, number);
  DJS_CHECK_ARG_IF_EXIST(2, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  int mode = JS_GET_ARG(1, number);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(2, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, mkdir, jcallback, cstr_str_safe(&path), mode);
  } else {
    FS_SYNC(env, mkdir, cstr_str_safe(&path), mode);
  }

  cstr_drop(&path);
  return ret_value;
}


JS_FUNCTION(fs_rmdir) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(1, string);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(1, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, rmdir, jcallback, cstr_str_safe(&path));
  } else {
    FS_SYNC(env, rmdir, cstr_str_safe(&path));
  }

  cstr_drop(&path);
  return ret_value;
}


JS_FUNCTION(fs_unlink) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(1, string);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(1, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, unlink, jcallback, cstr_str_safe(&path));
  } else {
    FS_SYNC(env, unlink, cstr_str_safe(&path));
  }

  cstr_drop(&path);
  return ret_value;
}


JS_FUNCTION(fs_rename) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(2, string, string);
  DJS_CHECK_ARG_IF_EXIST(2, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr old_path = JS_GET_ARG(0, string);
  cstr new_path = JS_GET_ARG(1, string);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(2, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, rename, jcallback, cstr_str_safe(&old_path),
             cstr_str_safe(&new_path));
  } else {
    FS_SYNC(env, rename, cstr_str_safe(&old_path),
            cstr_str_safe(&new_path));
  }

  cstr_drop(&old_path);
  cstr_drop(&new_path);
  return ret_value;
}

JS_FUNCTION(fs_symlink) {
  DJS_CHECK_ARGS(3, string, string, number);
  DJS_CHECK_ARG_IF_EXIST(3, function);

  const iotjs_environment_t* env = iotjs_environment_get();
  cstr target = JS_GET_ARG(0, string);
  cstr path = JS_GET_ARG(1, string);
  int32_t flags = (int32_t)JS_GET_ARG(2, number);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(2, function);
  jerry_value_t ret_value;

  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, symlink, jcallback, cstr_str_safe(&target), cstr_str_safe(&path), flags);
  } else {
    FS_SYNC(env, symlink, cstr_str_safe(&target), cstr_str_safe(&path), flags);
  }

  cstr_drop(&target);
  cstr_drop(&path);

  return ret_value;
}

JS_FUNCTION(fs_readlink) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(1, string);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(1, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, readlink, jcallback, cstr_str_safe(&path));
  } else {
    FS_SYNC(env, readlink, cstr_str_safe(&path));
  }

  cstr_drop(&path);
  return ret_value;
}

JS_FUNCTION(fs_realpath) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(1, string);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();

  cstr path = JS_GET_ARG(0, string);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(1, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, realpath, jcallback, cstr_str_safe(&path));
  } else {
    FS_SYNC(env, realpath, cstr_str_safe(&path));
  }

  cstr_drop(&path);
  return ret_value;
}

JS_FUNCTION(fs_read_dir) {
  DJS_CHECK_THIS();
  DJS_CHECK_ARGS(1, string);
  DJS_CHECK_ARG_IF_EXIST(1, function);

  const iotjs_environment_t* env = iotjs_environment_get();
  cstr path = JS_GET_ARG(0, string);
  const jerry_value_t jcallback = JS_GET_ARG_IF_EXIST(1, function);

  jerry_value_t ret_value;
  if (!jerry_value_is_null(jcallback)) {
    FS_ASYNC(env, scandir, jcallback, cstr_str_safe(&path), 0);
  } else {
    FS_SYNC(env, scandir, cstr_str_safe(&path), 0);
  }
  cstr_drop(&path);
  return ret_value;
}

JS_FUNCTION(js_fs_set_stats) {
  DJS_CHECK_ARGS(2, function, function);

  iotjs_environment_t* env = iotjs_environment_get();

  veil_env_set_class(env, VEIL_ENV_CLASS_STATS, jargv[0]);
  veil_env_set_class(env, VEIL_ENV_CLASS_BIG_INT_STATS, jargv[1]);

  return jerry_undefined();
}

jerry_value_t veil_init_fs(void) {
  jerry_value_t fs = jerry_object();

  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_SET_STATS, js_fs_set_stats);

  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_CLOSE, fs_close);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_OPEN, fs_open);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_READ, fs_read);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_WRITE, fs_write);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_STAT, fs_stat);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_FSTAT, fs_fstat);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_LSTAT, fs_lstat);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_MKDIR, fs_mkdir);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_RMDIR, fs_rmdir);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_UNLINK, fs_unlink);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_RENAME, fs_rename);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_READDIR, fs_read_dir);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_READLINK, fs_readlink);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_READPATH, fs_realpath);
  iotjs_jval_set_method(fs, IOTJS_MAGIC_STRING_SYMLINK, fs_symlink);

  VEIL_DEFINE_CONSTANT(fs, UV_FS_SYMLINK_DIR);
  VEIL_DEFINE_CONSTANT(fs, UV_FS_SYMLINK_JUNCTION);

  return fs;
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

