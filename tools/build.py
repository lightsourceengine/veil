#!/usr/bin/env python

# Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from __future__ import print_function
try:
    basestring
except:
    # in Python 3.x there is no basestring just str
    basestring = str

import argparse
import json
import sys
import re
import os

from common_py import path
from common_py.system.filesystem import FileSystem as fs
from common_py.system.executor import Executor as ex
from common_py.system.executor import Terminal
from common_py.system.sys_platform import Platform

platform = Platform()

# Initialize build options.
def init_options():
    # Check config options.
    arg_config = list(filter(lambda x: x.startswith('--config='), sys.argv))
    config_path = path.BUILD_CONFIG_PATH

    if arg_config:
        config_path = arg_config[-1].split('=', 1)[1]

    build_config = {}
    with open(config_path, 'rb') as f:
        build_config = json.loads(f.read().decode('ascii'))

    # Read config file and apply it to argv.
    argv = []

    list_with_commas = ['external-modules']

    for opt_key in build_config:
        opt_val = build_config[opt_key]
        if (opt_key in list_with_commas) and isinstance(opt_val, list):
            opt_val and argv.append('--%s=%s' % (opt_key, ','.join(opt_val)))
        elif isinstance(opt_val, basestring) and opt_val != '':
            argv.append(str('--%s=%s' % (opt_key, opt_val)))
        elif isinstance(opt_val, bool):
            if opt_val:
                argv.append('--%s' % opt_key)
        elif isinstance(opt_val, int):
            argv.append('--%s=%s' % (opt_key, opt_val))
        elif isinstance(opt_val, list):
            for val in opt_val:
                argv.append('--%s=%s' % (opt_key, val))

    # Apply command line argument to argv.
    argv = argv + sys.argv[1:]

    # Prepare argument parser.
    parser = argparse.ArgumentParser(description='Building tool for veil '
        'JavaScript framework for embedded systems.')

    iotjs_group = parser.add_argument_group('Arguments of veil',
        'The following arguments are related to the veil framework.')
    iotjs_group.add_argument('--buildtype',
        choices=['debug', 'release'], default='debug', type=str.lower,
        help='Specify the build type (default: %(default)s).')
    iotjs_group.add_argument('--builddir', default=path.BUILD_ROOT,
        help='Specify the build directory (default: %(default)s)')
    iotjs_group.add_argument('--buildlib', action='store_true', default=False,
        help='Build IoT.js static library only (default: %(default)s)')
    iotjs_group.add_argument('--create-shared-lib',
        action='store_true', default=False,
        help='Create shared library (default: %(default)s)')
    iotjs_group.add_argument('--cmake-param',
        action='append', default=[],
        help='Specify additional cmake parameters '
             '(can be used multiple times)')
    iotjs_group.add_argument('--compile-flag',
        action='append', default=[],
        help='Specify additional compile flags (can be used multiple times)')
    iotjs_group.add_argument('--clean', action='store_true', default=False,
        help='Clean build directory before build (default: %(default)s)')
    iotjs_group.add_argument('--config', default=path.BUILD_CONFIG_PATH,
        help='Specify the config file (default: %(default)s)',
        dest='config_path')
    iotjs_group.add_argument('--external-include-dir',
        action='append', default=[],
        help='Specify additional external include directory '
             '(can be used multiple times)')
    iotjs_group.add_argument('--external-lib',
        action='append', default=[],
        help='Specify additional external library '
             '(can be used multiple times)')
    iotjs_group.add_argument('--external-modules',
        action='store', default=set(), type=lambda x: set(x.split(',')),
        help='Specify the path of modules.json files which should be processed '
             '(format: path1,path2,...)')
    iotjs_group.add_argument('--link-flag',
        action='append', default=[],
        help='Specify additional linker flags (can be used multiple times)')
    iotjs_group.add_argument('--no-napi',
        action='store_true', default=False,
        help='Enable to build N-API feature')
    iotjs_group.add_argument('--no-check-valgrind',
        action='store_true', default=False,
        help='Disable test execution with valgrind after build')
    iotjs_group.add_argument('--init-submodule',
        action='store_true', default=False,
        help='Enable initialization of git submodules')
    iotjs_group.add_argument('--no-parallel-build',
        action='store_true', default=False,
        help='Disable parallel build')
    iotjs_group.add_argument('--nuttx-home', default=None, dest='sysroot',
        help='Specify the NuttX base directory (required for NuttX build)')
    iotjs_group.add_argument('--profile',
        help='Specify the module profile file for IoT.js')
    iotjs_group.add_argument('--run-test',
        nargs='?', default=False, const="quiet", choices=["full", "quiet"],
        help='Execute tests after build, optional argument specifies '
             'the level of output for the testrunner')
    iotjs_group.add_argument('--sysroot', action='store',
        help='The location of the development tree root directory (sysroot). '
             'Must be compatible with used toolchain.')
    iotjs_group.add_argument('--target-arch',
        choices=['arm', 'aarch64', 'arm64', 'x86', 'i686', 'x86_64', 'x64', 'mips', 'noarch'],
        default=platform.arch(),
        help='Specify the target architecture (default: %(default)s).')
    iotjs_group.add_argument('--target-board',
        choices=[None, 'rpiv6', 'rpiv7', 'rpiv8'],
        default=None, help='Specify the target board (default: %(default)s).')
    iotjs_group.add_argument('--target-os',
        choices=['linux', 'darwin', 'osx', 'mock', 'nuttx', 'tizen', 'tizenrt',
                 'openwrt', 'windows'],
        default=platform.os(),
        help='Specify the target OS (default: %(default)s).')



    jerry_group = parser.add_argument_group('Arguments of JerryScript',
        'The following arguments are related to the JavaScript engine under '
        'the framework. For example they can change the enabled features of '
        'the ECMA-262 standard.')
    jerry_group.add_argument('--jerry-cmake-param',
        action='append', default=[],
        help='Specify additional cmake parameters for JerryScript '
        '(can be used multiple times)')
    jerry_group.add_argument('--jerry-compile-flag',
        action='append', default=[],
        help='Specify additional compile flags for JerryScript '
             '(can be used multiple times)')
    jerry_group.add_argument('--jerry-debugger',
        action='store_true', default=False,
        help='Enable JerryScript-debugger')
    jerry_group.add_argument('--jerry-heaplimit',
        type=int, default=build_config['jerry-heaplimit'],
        help='Specify the size of the JerryScript max heap size '
             '(default: %(default)s)')
    jerry_group.add_argument('--jerry-heap-section',
        action='store', default=None,
        help='Specify the name of the JerryScript heap section')
    jerry_group.add_argument('--jerry-lto',
        action='store_true', default=False,
        help='Build JerryScript with LTO enabled')
    jerry_group.add_argument('--jerry-mem-stats',
        action='store_true', default=False,
        help='Enable JerryScript heap statistics')
    jerry_group.add_argument('--jerry-dump-byte-code',
        action='store_true', default=False,
        help='Enable JerryScript parser byte code dump')
    jerry_group.add_argument('--jerry-profile',
        metavar='FILE', action='store', default='es.next',
        help='Specify the profile for JerryScript (default: %(default)s). '
             'Possible values are "es5.1", "es.next" or an absolute '
             'path to a custom JerryScript profile file.')
    jerry_group.add_argument('--js-backtrace',
        choices=['ON', 'OFF'], type=str.upper,
        help='Enable/disable backtrace information of JavaScript code '
             '(default: ON in debug and OFF in release build)')

    options = parser.parse_args(argv)
    options.config = build_config

    return options


def adjust_options(options):
    # First fix some option inconsistencies.
    if options.target_os in ['nuttx', 'tizenrt']:
        options.buildlib = True
        if not options.sysroot:
            ex.fail('--sysroot needed for %s target' % options.target_os)

        options.sysroot = fs.abspath(options.sysroot)
        if not fs.exists(options.sysroot):
            ex.fail('NuttX sysroot %s does not exist' % options.sysroot)

    if options.target_arch == 'x86':
        options.target_arch = 'i686'
    if options.target_arch == 'x64':
        options.target_arch = 'x86_64'

    if options.target_os == 'darwin':
        options.no_check_valgrind = True

    if options.target_board in ['rpiv6', 'rpiv7', 'rpiv8']:
        options.no_check_valgrind = True

    # Then add calculated options.
    options.host_tuple = '%s-%s' % (platform.arch(), platform.os())

    if platform.os() == 'darwin' and platform.arch() != options.target_arch:
        cmake_path = fs.join(path.PROJECT_ROOT, 'cmake', 'config', 'cross', '%s.cmake')
        options.target_tuple = '%s-%s' % (options.target_arch, options.target_os)
        options.cmake_toolchain_file = cmake_path % options.target_tuple
    elif options.target_board in ['rpiv6', 'rpiv7']:
        cmake_path = fs.join(path.PROJECT_ROOT, 'cmake', 'config', 'cross', '%s.cmake')
        options.target_tuple = '%s-%s-%s' % (options.target_arch, options.target_os, 'rpi')
        options.cmake_toolchain_file = cmake_path % options.target_tuple
    elif options.target_board in ['rpiv8']:
        cmake_path = fs.join(path.PROJECT_ROOT, 'cmake', 'config', 'cross', '%s-%s.cmake')
        options.target_tuple = '%s-%s-%s' % (options.target_arch, options.target_os, 'rpi')
        options.cmake_toolchain_file = cmake_path % (options.target_arch, options.target_os)
    else:
        cmake_path = fs.join(path.PROJECT_ROOT, 'cmake', 'config', '%s.cmake')
        options.target_tuple = '%s-%s' % (options.target_arch, options.target_os)
        options.cmake_toolchain_file = cmake_path % options.target_tuple

    # Normalize the path of build directory.
    options.builddir = fs.normpath(options.builddir)

    options.build_root = fs.join(path.PROJECT_ROOT,
                                 options.builddir,
                                 options.target_tuple,
                                 options.buildtype)

    # Set the default value of '--js-backtrace' if it is not defined.
    if not options.js_backtrace:
        options.js_backtrace = "ON"


def print_progress(msg):
    print('==> %s\n' % msg)


def init_submodule():
    ex.check_run_cmd('git', ['submodule', 'init'])
    ex.check_run_cmd('git', ['submodule', 'update'])


def build_cmake_args(options):
    cmake_args = []
    # compile flags
    compile_flags = options.compile_flag
    compile_flags += options.jerry_compile_flag

    cmake_args.append("-DEXTERNAL_COMPILE_FLAGS='%s'" %
        (' '.join(compile_flags)))

    # link flags
    link_flags = options.link_flag

    if options.jerry_lto:
        link_flags.append('-flto')

    cmake_args.append("-DEXTERNAL_LINKER_FLAGS='%s'" % (' '.join(link_flags)))

    # external include dir
    include_dirs = []
    if options.target_os in ['nuttx', 'tizenrt'] and options.sysroot:
        include_dirs.append('%s/include' % options.sysroot)
        if options.target_board == 'stm32f4dis':
            include_dirs.append('%s/arch/arm/src/stm32' % options.sysroot)
        elif options.target_board == 'stm32f7nucleo':
            include_dirs.append('%s/arch/arm/src/stm32f7' % options.sysroot)

    if options.target_os == 'tizenrt':
        include_dirs.append('%s/../framework/include/iotbus' % options.sysroot)
    elif options.target_os == 'windows':
        cmake_args.append("-GVisual Studio 16 2019")
        if options.target_arch == "x86_64":
            cmake_args.append("-Ax64")

    include_dirs.extend(options.external_include_dir)
    cmake_args.append("-DEXTERNAL_INCLUDE_DIR='%s'" % (' '.join(include_dirs)))

    return cmake_args


def run_make(options, build_home, *args):
    make_opt = ['-C', build_home]
    make_opt.extend(args)
    if not options.no_parallel_build:
        make_opt.append('-j')

    ex.check_run_cmd('make', make_opt)

def run_build(options, build_home, *args):
    make_opt = ['--build', build_home, '--config', options.buildtype.capitalize()]
    make_opt.extend(args)

    ex.check_run_cmd('cmake', make_opt)

def get_on_off(boolean_value):
    if boolean_value:
        return 'ON'

    return 'OFF'


def build_iotjs(options):
    print_progress('Build veil')

    # Set IoT.js cmake options.
    cmake_opt = [
        '-B%s' % options.build_root,
        '-H%s' % path.PROJECT_ROOT,
        "-DCMAKE_TOOLCHAIN_FILE=%s" % options.cmake_toolchain_file,
        '-DCMAKE_BUILD_TYPE=%s' % options.buildtype.capitalize(),
        '-DTARGET_ARCH=%s' % options.target_arch,
        '-DTARGET_OS=%s' % options.target_os,
        '-DTARGET_BOARD=%s' % options.target_board,
        '-DENABLE_LTO=%s' % get_on_off(options.jerry_lto), # --jerry-lto
        '-DENABLE_MODULE_NAPI=%s' % get_on_off(not options.no_napi), # --n-api
        '-DENABLE_SNAPSHOT=OFF',
        '-DBUILD_LIB_ONLY=%s' % get_on_off(options.buildlib), # --buildlib
        '-DCREATE_SHARED_LIB=%s' % get_on_off(options.create_shared_lib),
        # --jerry-memstat
        '-DJERRY_MEM_STATS=%s' % get_on_off(options.jerry_mem_stats),
        # --jerry-dump-byte-code
        '-DJERRY_PARSER_DUMP_BYTE_CODE=%s' % get_on_off(options.jerry_dump_byte_code),
        # --external-modules
        "-DEXTERNAL_MODULES='%s'" % ';'.join(options.external_modules),
        # --jerry-profile
        "-DJERRY_PROFILE='%s'" % options.jerry_profile,
    ]

    if options.target_os in ['nuttx', 'tizenrt']:
        cmake_opt.append("-DEXTERNAL_LIBC_INTERFACE='%s'" %
                         fs.join(options.sysroot, 'include'))
        cmake_opt.append("-DTARGET_SYSTEMROOT='%s'" % options.sysroot)
        cmake_opt.append("-DEXTERNAL_CMAKE_SYSTEM_PROCESSOR=arm")

    # --jerry-heaplimit
    if options.jerry_heaplimit:
        cmake_opt.append('-DJERRY_GLOBAL_HEAP_SIZE=%d' %
                         options.jerry_heaplimit)
        if options.jerry_heaplimit > 512:
            cmake_opt.append("-DEXTRA_JERRY_CMAKE_PARAMS='%s'" %
                             "-DJERRY_CPOINTER_32_BIT=ON")

    # --jerry-heap-section
    if options.jerry_heap_section:
        cmake_opt.append("-DJERRY_ATTR_GLOBAL_HEAP='%s'" %
                         options.jerry_heap_section)

    # --jerry-debugger
    if options.jerry_debugger:
        cmake_opt.append("-DJERRY_DEBUGGER=ON")

    # --js-backtrace
    cmake_opt.append("-DJERRY_LINE_INFO=%s" %
                     options.js_backtrace)

    # --cmake-param
    cmake_opt.extend(options.cmake_param)

    # --external-lib
    cmake_opt.append("-DEXTERNAL_LIBS='%s'" %
                     (' '.join(options.external_lib)))

    # --jerry-cmake-param
    if options.jerry_cmake_param:
        cmake_opt.append("-DEXTRA_JERRY_CMAKE_PARAMS='%s'" %
                         ' '.join(options.jerry_cmake_param))

    # --profile
    if options.profile:
        cmake_opt.append("-DIOTJS_PROFILE='%s'" % options.profile)

    # Add common cmake options.
    cmake_opt.extend(build_cmake_args(options))

    # Run cmake.
    ex.check_run_cmd('cmake', cmake_opt)

    if options.target_os == 'windows':
        run_build(options, options.build_root)
    else:
        run_make(options, options.build_root)

if __name__ == '__main__':
    # Initialize build option object.
    options = init_options()
    adjust_options(options)

    if options.clean:
        print_progress('Clear build directories')
        test_build_root = fs.join(path.TEST_ROOT,
                                  'napi',
                                  'build')
        fs.rmtree(test_build_root)
        fs.rmtree(options.build_root)

    # Perform init-submodule.
    if options.init_submodule:
        print_progress('Initialize submodule')
        init_submodule()

    build_iotjs(options)

    Terminal.pprint("\nveil Build Succeeded!!\n", Terminal.green)
