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

/* Windows compatibility defines */
#ifdef WIN32
#include <fcntl.h>
#include <windows.h>
/* Map windows _O_* to O_* defines as on Linux systems. */
#define O_APPEND _O_APPEND
#define O_CREAT _O_CREAT
#define O_EXCL _O_EXCL
#define O_RDONLY _O_RDONLY
#define O_RDWR _O_RDWR
#define O_TRUNC _O_TRUNC
#define O_WRONLY _O_WRONLY
/* On windows there is no O_SYNC directly, disable it for now. */
#define O_SYNC 0x0

#endif

#ifndef S_ISREG
#define S_ISREG(mode) (((mode) & (S_IFMT)) == S_IFREG)
#endif

/*
 * Contains code from the following projects:
 *
 * https://github.com/jerryscript-project/iotjs
 * Copyright 2018-present Samsung Electronics Co., Ltd. and other contributors
 *
 * See the veil LICENSE file for more information.
 */
