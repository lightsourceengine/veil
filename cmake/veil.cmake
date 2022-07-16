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

if(NOT DEFINED PYTHON)
  set(PYTHON "python")
endif()

include(${CMAKE_CURRENT_LIST_DIR}/JSONParser.cmake)

set(IOTJS_SOURCE_DIR ${CMAKE_SOURCE_DIR}/src)

# Platform configuration
# Look for files under src/platform/<system>/
string(TOLOWER ${CMAKE_SYSTEM_NAME} IOTJS_SYSTEM_OS)
set(PLATFORM_OS_DIR
    "${IOTJS_SOURCE_DIR}/platform/${IOTJS_SYSTEM_OS}")
file(GLOB IOTJS_PLATFORM_SRC "${PLATFORM_OS_DIR}/veil_*.c")

# Module configuration - listup all possible native C modules
function(getListOfVars prefix pattern varResult)
    set(moduleNames)
    get_cmake_property(vars VARIABLES)
    string(REPLACE "." "\\." prefix ${prefix})
    foreach(var ${vars})
      string(REGEX MATCH
             "(^|;)${prefix}${pattern}($|;)"
             matchedVar "${var}")
      if(matchedVar)
        list(APPEND moduleNames ${CMAKE_MATCH_2})
      endif()
    endforeach()
    list(REMOVE_DUPLICATES moduleNames)
    set(${varResult} ${moduleNames} PARENT_SCOPE)
endfunction()

function(addModuleDependencies module varResult)
  string(TOUPPER ${module} MODULE)
  set(moduleDefines)

  set(MODULE_PREFIX ${IOTJS_MODULE_${MODULE}_JSON}.modules.${module})

  if(NOT "${${MODULE_PREFIX}.import}"
     STREQUAL "")
    foreach(idx
            ${${MODULE_PREFIX}.import})
      set(dependency
          ${${MODULE_PREFIX}.import_${idx}})
      string(TOUPPER ${dependency} DEPENDENCY)
      if(NOT ${ENABLE_MODULE_${DEPENDENCY}})
        list(APPEND moduleDefines ENABLE_MODULE_${DEPENDENCY})
        addModuleDependencies(${dependency} deps)
        list(APPEND varResult ${deps})
        list(REMOVE_DUPLICATES varResult)
      endif()
    endforeach()
  endif()

  set(PLATFORM_REQUIRE_PREFIX ${MODULE_PREFIX}.platforms.${IOTJS_SYSTEM_OS})
  foreach(idx ${${PLATFORM_REQUIRE_PREFIX}.import})
    set(dependency ${${PLATFORM_REQUIRE_PREFIX}.import_${idx}})
    string(TOUPPER ${dependency} DEPENDENCY)
    if (NOT ${ENABLE_MODULE_${DEPENDENCY}})
      list(APPEND moduleDefines ENABLE_MODULE_${DEPENDENCY})
      addModuleDependencies(${dependency} deps)
      list(APPEND varResult ${deps})
      list(REMOVE_DUPLICATES varResult)
    endif()
  endforeach()

  set(${varResult} ${moduleDefines} PARENT_SCOPE)
endfunction()

# Set the default profile if not specified
set(IOTJS_PROFILE "${CMAKE_SOURCE_DIR}/profiles/default.profile"
    CACHE STRING "Path to profile.")

if(NOT IS_ABSOLUTE ${IOTJS_PROFILE})
  set(IOTJS_PROFILE "${CMAKE_SOURCE_DIR}/${IOTJS_PROFILE}")
endif()

# Enable the modules defined by the profile
if(EXISTS ${IOTJS_PROFILE})
  file(READ "${IOTJS_PROFILE}" PROFILE_SETTINGS)
  string(REGEX REPLACE "^#.*$" "" PROFILE_SETTINGS "${PROFILE_SETTINGS}")
  string(REGEX REPLACE "[\r|\n]" ";" PROFILE_SETTINGS "${PROFILE_SETTINGS}")

  foreach(module_define ${PROFILE_SETTINGS})
    set(${module_define} ON CACHE BOOL "ON/OFF")
  endforeach()
else()
  message(FATAL_ERROR "Profile file: '${IOTJS_PROFILE}' doesn't exist!")
endif()

set(IOTJS_MODULES)
set(MODULES_INCLUDE_DIR)

# Add the basic descriptor file (src/modules.json)
list(APPEND EXTERNAL_MODULES ${IOTJS_SOURCE_DIR})

set(iotjs_module_idx 0)
foreach(module_descriptor ${EXTERNAL_MODULES})
  get_filename_component(MODULE_DIR ${module_descriptor} ABSOLUTE)

  if(NOT EXISTS "${MODULE_DIR}/modules.json")
    message(FATAL_ERROR "The modules.json file doesn't exist in ${MODULE_DIR}")
  endif()

  list(APPEND MODULES_INCLUDE_DIR ${MODULE_DIR})
  list(APPEND IOTJS_MODULES_JSONS "${iotjs_module_idx}")
  set(CURR_JSON "IOTJS_MODULES_JSON_${iotjs_module_idx}")
  set(${CURR_JSON}_PATH ${MODULE_DIR})

  file(READ "${MODULE_DIR}/modules.json" IOTJS_MODULES_JSON_FILE)
  sbeParseJson(${CURR_JSON} IOTJS_MODULES_JSON_FILE)
  getListOfVars("${CURR_JSON}.modules." "([A-Za-z0-9_]+)[A-Za-z0-9_.]*"
                _IOTJS_MODULES)
  list(APPEND IOTJS_MODULES ${_IOTJS_MODULES})

  foreach(module ${_IOTJS_MODULES})
    string(TOUPPER ${module} MODULE)
    set(IOTJS_MODULE_${MODULE}_JSON ${CURR_JSON})
  endforeach()

  math(EXPR iotjs_module_idx "${iotjs_module_idx} + 1")
endforeach(module_descriptor)

list(REMOVE_DUPLICATES IOTJS_MODULES)

# Turn off the other modules
foreach(module ${IOTJS_MODULES})
  string(TOUPPER ${module} MODULE)
  set(ENABLE_MODULE_${MODULE} OFF CACHE BOOL "ON/OFF")
endforeach()

# Resolve the dependencies and set the ENABLE_MODULE_[NAME] variables
foreach(module ${IOTJS_MODULES})
  string(TOUPPER ${module} MODULE)
  if(${ENABLE_MODULE_${MODULE}})
    addModuleDependencies(${module} deps)
    foreach(module_define ${deps})
      set(${module_define} ON)
    endforeach()
    unset(deps)
  endif()
endforeach()

set(IOTJS_JS_MODULES)
set(IOTJS_JS_MODULE_SRC)
set(IOTJS_NATIVE_MODULES)
set(IOTJS_NATIVE_MODULE_SRC)
set(IOTJS_MODULE_DEFINES)
# TODO: make a configuration to use bundle minified or non-minified js
set(VEIL_JS_GEN_DIR "${ROOT_DIR}/generated/js-min")
#set(VEIL_JS_GEN_DIR "${ROOT_DIR}/src/js")

message("veil module configuration:")
getListOfVars("ENABLE_MODULE_" "([A-Za-z0-9_]+)" IOTJS_ENABLED_MODULES)
foreach(MODULE ${IOTJS_ENABLED_MODULES})
  set(MODULE_DEFINE_VAR "ENABLE_MODULE_${MODULE}")
  # Set the defines for build
  if(${MODULE_DEFINE_VAR})
    list(APPEND IOTJS_MODULE_DEFINES "-D${MODULE_DEFINE_VAR}=1")
  else()
    list(APPEND IOTJS_MODULE_DEFINES "-D${MODULE_DEFINE_VAR}=0")
  endif()
endforeach()

set(EXTRA_CMAKE_FILES)

# Collect the files of enabled modules
foreach(MODULE ${IOTJS_ENABLED_MODULES})
  if(${ENABLE_MODULE_${MODULE}})
    string(TOLOWER ${MODULE} module)
    set(IOTJS_MODULES_JSON ${IOTJS_MODULE_${MODULE}_JSON})
    set(MODULE_BASE_DIR ${${IOTJS_MODULES_JSON}_PATH})
    set(MODULE_PREFIX ${IOTJS_MODULES_JSON}.modules.${module}.)

    # Add js source
    set(MODULE_JS_FILE ${${MODULE_PREFIX}js_file})
    if(NOT "${MODULE_JS_FILE}" STREQUAL "")
      string(FIND "${MODULE_JS_FILE}" "." IOTJS_STARTS_WITH)
      if ("${IOTJS_STARTS_WITH}" EQUAL 0)
        # allow ./ to be relative to the json file. used for user specfied module.json files
        set(MODULE_JS_FILE "${MODULE_BASE_DIR}/${MODULE_JS_FILE}")
      else()
        # replace $JS_SRC_DIR variable with the configured source dir
        string(REPLACE "$JS_GEN" "${VEIL_JS_GEN_DIR}" MODULE_JS_FILE "${MODULE_JS_FILE}")
      endif()

      set(JS_PATH "${MODULE_JS_FILE}")
      if(EXISTS "${JS_PATH}")
        list(APPEND IOTJS_JS_MODULES "${module}=${JS_PATH}")
        list(APPEND IOTJS_JS_MODULE_SRC ${JS_PATH})
      else()
        message(FATAL_ERROR "JS file doesn't exist: ${JS_PATH}")
      endif()
    endif()

    # Check extra cmake file
    set(EXTRA_CMAKE_FILE ${${MODULE_PREFIX}cmakefile})
    if(NOT "${EXTRA_CMAKE_FILE}" STREQUAL "")
      set(EXTRA_CMAKE_FILE_PATH "${MODULE_BASE_DIR}/${EXTRA_CMAKE_FILE}")
      if(EXISTS "${EXTRA_CMAKE_FILE_PATH}")
        list(APPEND EXTRA_CMAKE_FILES "${EXTRA_CMAKE_FILE_PATH}")
      else()
        message(FATAL_ERROR
                "CMake file doesn't exists: ${EXTRA_CMAKE_FILE_PATH}")
      endif()
    endif()

    # Add platform-related native source
    if(NOT "${${MODULE_PREFIX}native_files}" STREQUAL ""
       AND NOT "${${MODULE_PREFIX}init}" STREQUAL "")
      list(APPEND IOTJS_NATIVE_MODULES "${MODULE}")
    endif()

    # Add common native source
    foreach(idx ${${MODULE_PREFIX}native_files})
      set(MODULE_C_FILE
          ${${MODULE_PREFIX}native_files_${idx}})
      set(MODULE_C_FILE "${MODULE_BASE_DIR}/${MODULE_C_FILE}")
      if(EXISTS "${MODULE_C_FILE}")
        list(APPEND IOTJS_NATIVE_MODULE_SRC ${MODULE_C_FILE})
      else()
        message(FATAL_ERROR "C file doesn't exist: ${MODULE_C_FILE}")
      endif()
    endforeach()

    # Add external libraries
    foreach(idx ${${MODULE_PREFIX}external_libs})
      list(APPEND EXTERNAL_LIBS
          ${${MODULE_PREFIX}external_libs_${idx}})
    endforeach()

    getListOfVars("${MODULE_PREFIX}" "([A-Za-z0-9_]+[A-Za-z])[A-Za-z0-9_.]*"
                  MODULE_KEYS)
    list(FIND MODULE_KEYS "platforms" PLATFORMS_KEY)

    set(PLATFORMS_PREFIX ${MODULE_PREFIX}platforms.)
    if(${PLATFORMS_KEY} GREATER -1)
      getListOfVars("${PLATFORMS_PREFIX}"
                    "([A-Za-z0-9_]+[A-Za-z])[A-Za-z0-9_.]*" MODULE_PLATFORMS)
      list(FIND MODULE_PLATFORMS ${IOTJS_SYSTEM_OS} PLATFORM_NATIVES)

      # Add plaform-dependant information
      if(${PLATFORM_NATIVES} GREATER -1)
        # native source if exists...
        foreach(idx ${${PLATFORMS_PREFIX}${IOTJS_SYSTEM_OS}.native_files})
          set(MODULE_PLATFORM_FILE
              ${${PLATFORMS_PREFIX}${IOTJS_SYSTEM_OS}.native_files_${idx}})
          set(MODULE_PLATFORM_FILE "${MODULE_BASE_DIR}/${MODULE_PLATFORM_FILE}")
          if(EXISTS "${MODULE_PLATFORM_FILE}")
            list(APPEND IOTJS_NATIVE_MODULE_SRC ${MODULE_PLATFORM_FILE})
          else()
            message(FATAL_ERROR "C file doesn't exist: ${MODULE_PLATFORM_FILE}")
          endif()
        endforeach()

        # external libraries....
        foreach(idx ${${PLATFORMS_PREFIX}${IOTJS_SYSTEM_OS}.external_libs})
          list(APPEND EXTERNAL_LIBS
              ${${PLATFORMS_PREFIX}${IOTJS_SYSTEM_OS}.external_libs_${idx}})
        endforeach()
      # ...otherwise from 'undefined' section.
      else()
        # add native files
        foreach(idx ${${PLATFORMS_PREFIX}undefined.native_files})
          set(MODULE_UNDEFINED_FILE
              "${${MODULE_PREFIX}undefined.native_files_${idx}}")
          set(MODULE_UNDEFINED_FILE
              "${MODULE_BASE_DIR}/${MODULE_UNDEFINED_FILE}")
          if(EXISTS "${MODULE_UNDEFINED_FILE}")
            list(APPEND IOTJS_NATIVE_MODULE_SRC ${MODULE_UNDEFINED_FILE})
          else()
            message(FATAL_ERROR "${MODULE_UNDEFINED_FILE} does not exists.")
          endif()
        endforeach()

        # external libraries....
        foreach(idx ${${PLATFORMS_PREFIX}undefined.external_libs})
          list(APPEND EXTERNAL_LIBS
              ${${PLATFORMS_PREFIX}undefined.external_libs_${idx}})
        endforeach()
      endif()
    endif()
  endif()
endforeach(MODULE)

# TODO: if CommonJS is supported, re-enable the module lexer
# lexer does not have a non-minified version
# list(APPEND IOTJS_JS_MODULES "lexer=${ROOT_DIR}/generated/js-min/lexer.mjs")

# Generate src/iotjs_module_inl.h
# Build up init function prototypes
set(IOTJS_MODULE_INITIALIZERS "")
foreach(MODULE ${IOTJS_NATIVE_MODULES})
  set(IOTJS_MODULES_JSON ${IOTJS_MODULE_${MODULE}_JSON})
  string(TOLOWER ${MODULE} module)

  set(IOTJS_MODULE_INITIALIZERS "${IOTJS_MODULE_INITIALIZERS}
extern jerry_value_t ${${IOTJS_MODULES_JSON}.modules.${module}.init}(void);")
endforeach()

# Build up module entries
set(IOTJS_MODULE_ENTRIES "")
set(IOTJS_MODULE_OBJECTS "")
foreach(MODULE ${IOTJS_NATIVE_MODULES})
  set(IOTJS_MODULES_JSON ${IOTJS_MODULE_${MODULE}_JSON})
  string(TOLOWER ${MODULE} module)
  set(INIT_FUNC ${${IOTJS_MODULES_JSON}.modules.${module}.init})

  set(IOTJS_MODULE_ENTRIES  "${IOTJS_MODULE_ENTRIES}
  { \"${module}\", ${INIT_FUNC} },")
  set(IOTJS_MODULE_OBJECTS "${IOTJS_MODULE_OBJECTS}
    { 0 },")
endforeach()

# Build up the contents of src/iotjs_module_inl.h
list(LENGTH IOTJS_NATIVE_MODULES IOTJS_MODULE_COUNT)
set(IOTJS_MODULE_INL_H "/* File generated via iotjs.cmake */
${IOTJS_MODULE_INITIALIZERS}

const unsigned iotjs_module_count = ${IOTJS_MODULE_COUNT};

const
iotjs_module_ro_data_t iotjs_module_ro_data[${IOTJS_MODULE_COUNT}] = {
${IOTJS_MODULE_ENTRIES}
};

iotjs_module_rw_data_t iotjs_module_rw_data[${IOTJS_MODULE_COUNT}] = {
${IOTJS_MODULE_OBJECTS}
};
")

file(WRITE ${IOTJS_SOURCE_DIR}/iotjs_module_inl.h "${IOTJS_MODULE_INL_H}")

# Cleanup
unset(IOTJS_MODULE_INL_H)
unset(IOTJS_MODULES_JSON_FILE)

foreach(idx ${IOTJS_MODULES_JSONS})
  sbeClearJson(IOTJS_MODULES_JSON_${idx})
  unset(IOTJS_MODULES_JSON_${idx}_PATH)
endforeach()

foreach(module ${IOTJS_MODULES})
  string(TOUPPER ${module} MODULE)
  unset(IOTJS_MODULE_${MODULE}_JSON)
endforeach()

# Common compile flags

if (USING_GCC_4_9)
  # XXX
  # stc/cmap.h creates a platform specific c_umul128() macro. on 4.9.4, __int128 is not available and
  # stc does not have a fallback. Either way, veil uses i_size uint32_t, so c_umul128() is never used.
  # gcc considers c_umul128() and undefined function, printing a warning. This flag gets rid of the
  # warning.
  iotjs_add_link_flags(-Wl,-u,c_umul128)
else()
  iotjs_add_compile_flags(-Wall)
endif()

if(NOT USING_MSVC)
  if (NOT USING_GCC_4_9)
    iotjs_add_compile_flags(-Wextra -Werror)
  endif()

  iotjs_add_compile_flags(-Wno-unused-parameter -Wno-pragmas)
  iotjs_add_compile_flags(-Wsign-conversion -std=gnu99)
endif()

if(ENABLE_SNAPSHOT)
  set(JS2C_SNAPSHOT_ARG --snapshot-tool=${JERRY_HOST_SNAPSHOT})
  iotjs_add_compile_flags(-DENABLE_SNAPSHOT)
endif()

# Run js2c
set(JS2C_RUN_MODE "release")
if("${CMAKE_BUILD_TYPE}" STREQUAL "Debug")
  set(JS2C_RUN_MODE "debug")
endif()

if(USING_MSVC)
  set(JS2C_PREPROCESS_ARGS /EP /d1PP)
else()
  set(JS2C_PREPROCESS_ARGS -E -dD)
endif()

string (REPLACE ";" "," IOTJS_JS_MODULES_STR "${IOTJS_JS_MODULES}")
add_custom_command(
  OUTPUT ${IOTJS_SOURCE_DIR}/iotjs_js.c ${IOTJS_SOURCE_DIR}/iotjs_js.h
  COMMAND ${CMAKE_C_COMPILER} ${JS2C_PREPROCESS_ARGS} ${IOTJS_MODULE_DEFINES}
            ${IOTJS_SOURCE_DIR}/iotjs_magic_strings.h
          > ${IOTJS_SOURCE_DIR}/iotjs_magic_strings.in
  COMMAND ${PYTHON} ${ROOT_DIR}/tools/js2c.py
  ARGS --buildtype=${JS2C_RUN_MODE}
       --modules "${IOTJS_JS_MODULES_STR}"
       ${JS2C_SNAPSHOT_ARG}
  COMMAND ${CMAKE_COMMAND} -E remove
            -f ${IOTJS_SOURCE_DIR}/iotjs_magic_strings.in
  DEPENDS ${ROOT_DIR}/tools/js2c.py
#          jerry-snapshot
          ${IOTJS_JS_MODULE_SRC}
)

# Load all external module cmake files
foreach(MODULE_EXTRA_CMAKE_FILE ${EXTRA_CMAKE_FILES})
  message("Using CMake file: ${MODULE_EXTRA_CMAKE_FILE}")

  set(MODULE_BINARY_DIR ${CMAKE_BINARY_DIR}/external/)
  set(MODULE_LIBS)
  get_filename_component(MODULE_DIR ${MODULE_EXTRA_CMAKE_FILE} DIRECTORY)

  # Variables which should be used by the external module(s):
  # - MODULE_DIR - the modules root directory
  # - MODULE_BINARY_DIR - the build directory for the current module
  # - MODULE_LIBS - list of libraries to use during linking (set this)
  include(${MODULE_EXTRA_CMAKE_FILE})

  if (NOT MODULE_NAME)
    message(FATAL_ERROR
            "MODULE_NAME was not specified in ${MODULE_EXTRA_CMAKE_FILE}")
  endif()

  list(APPEND EXTERNAL_LIBS ${MODULE_LIBS})

  # Just to make sure it will always be unset
  unset(MODULE_NAME) # This is usually set by the included cmake file
  unset(MODULE_BINARY_DIR)
  unset(MODULE_LIBS)
endforeach()

# Collect all sources into LIB_IOTJS_SRC
file(GLOB LIB_IOTJS_SRC ${IOTJS_SOURCE_DIR}/*.c)
list(APPEND LIB_IOTJS_SRC
  ${IOTJS_SOURCE_DIR}/iotjs_js.c
  ${IOTJS_SOURCE_DIR}/iotjs_js.h
  ${IOTJS_NATIVE_MODULE_SRC}
  ${IOTJS_PLATFORM_SRC}
)

separate_arguments(EXTERNAL_INCLUDE_DIR)
separate_arguments(EXTERNAL_LIBS)

set(IOTJS_INCLUDE_DIRS
  ${EXTERNAL_INCLUDE_DIR}
  ${ROOT_DIR}/include
  ${IOTJS_SOURCE_DIR}
  ${MODULES_INCLUDE_DIR}
  ${PLATFORM_OS_DIR}
#  ${JERRY_PORT_DIR}/include
  ${JERRY_EXT_DIR}/include
  ${JERRY_INCLUDE_DIR}
  ${HTTPPARSER_INCLUDE_DIR}
  ${MBEDTLS_INCLUDE_DIR}
  ${TUV_INCLUDE_DIR}
  ${ROOT_DIR}/deps/node-api-headers/include
)

if(NOT BUILD_LIB_ONLY)
  if("${CMAKE_SYSTEM_NAME}" STREQUAL "Darwin")
    iotjs_add_link_flags("-Xlinker -map -Xlinker veil.map")
  elseif(USING_MSVC)
    iotjs_add_link_flags("/MAP:veil.map")
  else()
    iotjs_add_link_flags("-Xlinker -Map -Xlinker veil.map")
  endif()
endif()

# Print out some configs
message(STATUS "veil configured with:")
message(STATUS "BUILD_LIB_ONLY           ${BUILD_LIB_ONLY}")
message(STATUS "CMAKE_BUILD_TYPE         ${CMAKE_BUILD_TYPE}")
message(STATUS "CMAKE_C_FLAGS            ${CMAKE_C_FLAGS}")
message(STATUS "CMAKE_TOOLCHAIN_FILE     ${CMAKE_TOOLCHAIN_FILE}")
message(STATUS "ENABLE_LTO               ${ENABLE_LTO}")
message(STATUS "ENABLE_SNAPSHOT          ${ENABLE_SNAPSHOT}")
message(STATUS "EXTERNAL_INCLUDE_DIR     ${EXTERNAL_INCLUDE_DIR}")
message(STATUS "EXTERNAL_LIBC_INTERFACE  ${EXTERNAL_LIBC_INTERFACE}")
message(STATUS "EXTERNAL_LIBS            ${EXTERNAL_LIBS}")
message(STATUS "EXTERNAL_MODULES         ${EXTERNAL_MODULES}")
message(STATUS "IOTJS_LINKER_FLAGS       ${IOTJS_LINKER_FLAGS}")
message(STATUS "IOTJS_PROFILE            ${IOTJS_PROFILE}")
message(STATUS "JERRY_DEBUGGER           ${JERRY_DEBUGGER}")
message(STATUS "JERRY_GLOBAL_HEAP_SIZE   ${JERRY_GLOBAL_HEAP_SIZE}")
message(STATUS "JERRY_MEM_STATS          ${JERRY_MEM_STATS}")
message(STATUS "JERRY_PARSER_DUMP_BYTE_CODE ${JERRY_PARSER_DUMP_BYTE_CODE}")
message(STATUS "JERRY_PROFILE            ${JERRY_PROFILE}")
message(STATUS "TARGET_ARCH              ${TARGET_ARCH}")
message(STATUS "TARGET_BOARD             ${TARGET_BOARD}")
message(STATUS "TARGET_OS                ${TARGET_OS}")
message(STATUS "TARGET_SYSTEMROOT        ${TARGET_SYSTEMROOT}")

iotjs_add_compile_flags(${IOTJS_MODULE_DEFINES})

if(JERRY_DEBUGGER)
  iotjs_add_compile_flags("-DJERRY_DEBUGGER")
endif()

if(JERRY_MEM_STATS)
  iotjs_add_compile_flags("-DJERRY_MEM_STATS")
endif()

if(JERRY_PARSER_DUMP_BYTE_CODE)
  iotjs_add_compile_flags("-DJERRY_PARSER_DUMP_BYTE_CODE")
endif()

file(GLOB IOTJS_HEADERS "${ROOT_DIR}/src/*.h")
file(GLOB JERRY_HEADERS "${ROOT_DIR}/deps/jerry/jerry-core/include/*.h")
file(GLOB LIBUV_HEADERS "${ROOT_DIR}/deps/libtuv/include/*.h")

set(IOTJS_PUBLIC_HEADERS
  "include/veil.h"
  "deps/node-api-headers/include/node_api.h"
  "deps/node-api-headers/include/node_api_types.h"
  "deps/node-api-headers/include/js_native_api.h"
  "deps/node-api-headers/include/js_native_api_types.h"
  ${IOTJS_HEADERS}
  ${JERRY_HEADERS}
  ${LIBUV_HEADERS}
)

# Configure the libveil
set(TARGET_LIB_VEIL libveil)
if(CREATE_SHARED_LIB)
  add_library(${TARGET_LIB_VEIL} SHARED ${LIB_IOTJS_SRC})
else()
  add_library(${TARGET_LIB_VEIL} STATIC ${LIB_IOTJS_SRC})

  # FIXME: module specific condition should not be in the main cmake
  if(${ENABLE_MODULE_NAPI})
    # Force symbols to be entered in the output file as undefined symbols.
    file(READ "${IOTJS_SOURCE_DIR}/napi/node_symbols.txt" NODE_SYMBOLS)
    string(REGEX REPLACE "[\r|\n]" ";" NODE_SYMBOLS "${NODE_SYMBOLS}")

    if(USING_MSVC)
      set(NODE_SYMBOL_SEPARATOR " /INCLUDE:")
      if("${TARGET_ARCH}" STREQUAL "i686")
        set(NODE_SYMBOL_SEPARATOR "${NODE_SYMBOL_SEPARATOR}_")
      endif()
    else()
      set(NODE_SYMBOLS_LINK_FLAGS "-Wl")
      if (USING_CLANG)
        set(NODE_SYMBOL_SEPARATOR ",-u,_")
      else()
        set(NODE_SYMBOL_SEPARATOR ",-u,")
      endif()
    endif()

    foreach(NODE_SYMBOL ${NODE_SYMBOLS})
      set(NODE_SYMBOLS_LINK_FLAGS "${NODE_SYMBOLS_LINK_FLAGS}${NODE_SYMBOL_SEPARATOR}${NODE_SYMBOL}")
    endforeach()

    iotjs_add_link_flags(${NODE_SYMBOLS_LINK_FLAGS})
  endif()
endif(CREATE_SHARED_LIB)

add_dependencies(${TARGET_LIB_VEIL}
  ${JERRY_LIBS}
  ${TUV_LIBS}
  libhttp-parser
  ${MBEDTLS_LIBS}
  libutf16
  stc
)

set_target_properties(${TARGET_LIB_VEIL} PROPERTIES
  OUTPUT_NAME veil
  ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  PUBLIC_HEADER "${IOTJS_PUBLIC_HEADERS}"
)

if(NOT USING_MSVC)
  target_compile_options(
      ${TARGET_LIB_VEIL}
      PRIVATE
      -Wno-missing-field-initializers
      -Wno-missing-braces
      -Wno-implicit-fallthrough
      -Wno-sign-compare
  )
endif()

target_include_directories(${TARGET_LIB_VEIL}
  PRIVATE ${IOTJS_INCLUDE_DIRS})
target_link_libraries(${TARGET_LIB_VEIL}
  ${CMAKE_DL_LIBS}
  ${JERRY_LIBS}
  ${JERRY_NATIVE_LIBS}
  ${TUV_LIBS}
  ${TUV_NATIVE_LIBS}
  libhttp-parser
  ${MBEDTLS_LIBS}
  ${EXTERNAL_LIBS}
  libutf16
  stc
)

if("${LIB_INSTALL_DIR}" STREQUAL "")
  set(LIB_INSTALL_DIR "lib")
endif()

if("${BIN_INSTALL_DIR}" STREQUAL "")
  set(BIN_INSTALL_DIR "bin")
endif()

if("${INC_INSTALL_DIR}" STREQUAL "")
  set(INC_INSTALL_DIR "include/veil")
endif()

# Configure the veil executable
if(NOT BUILD_LIB_ONLY)
  set(TARGET_VEIL veil)
  message(STATUS "CMAKE_BINARY_DIR        ${CMAKE_BINARY_DIR}")
  message(STATUS "BINARY_INSTALL_DIR      ${INSTALL_PREFIX}/${BIN_INSTALL_DIR}")
  message(STATUS "LIBRARY_INSTALL_DIR     ${INSTALL_PREFIX}/${LIB_INSTALL_DIR}")
  message(STATUS "INCLUDE_INSTALL_DIR     ${INSTALL_PREFIX}/${INC_INSTALL_DIR}")

  add_executable(${TARGET_VEIL} ${ROOT_DIR}/src/platform/linux/veil_linux.c)
  set_target_properties(${TARGET_VEIL} PROPERTIES
    LINK_FLAGS "${IOTJS_LINKER_FLAGS}"
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
  )
  target_include_directories(${TARGET_VEIL} PRIVATE ${IOTJS_INCLUDE_DIRS})
  target_link_libraries(${TARGET_VEIL} ${TARGET_LIB_VEIL})
  install(TARGETS ${TARGET_VEIL} ${TARGET_LIB_VEIL}
          RUNTIME DESTINATION "${BIN_INSTALL_DIR}"
          ARCHIVE DESTINATION "${LIB_INSTALL_DIR}"
          LIBRARY DESTINATION "${LIB_INSTALL_DIR}"
          PUBLIC_HEADER DESTINATION "${INC_INSTALL_DIR}")
else()
  install(TARGETS ${TARGET_LIB_VEIL} DESTINATION ${LIB_INSTALL_DIR})
endif()
