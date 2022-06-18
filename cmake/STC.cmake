set(TARGET_LIB_STC stc)

add_library(${TARGET_LIB_STC}
    STATIC
    ${ROOT_DIR}/deps/STC/src/utf8.c
)

if(NOT USING_MSVC)
  target_compile_options(${TARGET_LIB_STC} PRIVATE -Wno-missing-field-initializers -Wno-missing-braces)
endif()

target_include_directories(${TARGET_LIB_STC}
    PUBLIC
    ${ROOT_DIR}/deps/STC/repo/include)
