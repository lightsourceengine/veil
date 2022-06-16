set(TARGET_LIB_UTF16 libutf16)

add_library(${TARGET_LIB_UTF16}
    STATIC
    ${ROOT_DIR}/deps/libutf16/src/utf16_to_utf8_one.c
    ${ROOT_DIR}/deps/libutf16/src/utf16_to_utf8.c
    ${ROOT_DIR}/deps/libutf16/src/utf8_cstd.c)

target_include_directories(${TARGET_LIB_UTF16}
    PUBLIC
    ${ROOT_DIR}/deps/libutf16)
