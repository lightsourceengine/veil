#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

SRC_BUILD="${SCRIPT_DIR}/../build"
SRC_PACKAGE="${SRC_BUILD}/package"

if [ "${1}x" = "x" ]; then
  case "$OSTYPE" in
    darwin*)
      VEIL_OS=macos
    ;;
    linux*)
      VEIL_OS=linux
    ;;
    msys*)
      VEIL_OS=windows
    ;;
    *)
      VEIL_OS=unknown
    ;;
  esac
else
  VEIL_OS="${1}"
fi

VEIL_ARCH=${2:-x64}
VEIL_VERSION="1.0.0"
VEIL_PACKAGE_NAME="veil-${VEIL_VERSION}-${VEIL_OS}-${VEIL_ARCH}"
VEIL_PACKAGE_PATH="${SRC_PACKAGE:?}/${VEIL_PACKAGE_NAME}"

if [ "${VEIL_OS}" = "macos" ]; then
  BUILD_OS="darwin"
else
  BUILD_OS=${VEIL_OS}
fi

if [ "${VEIL_ARCH}" = "x64" ]; then
  BUILD_ARCH="x86_64"
else
  BUILD_ARCH=${VEIL_ARCH}
fi

if [ ! -d "${SRC_PACKAGE:?}" ]; then
  mkdir "${SRC_PACKAGE:?}"
fi

if [ -d "${VEIL_PACKAGE_PATH}" ]; then
  rm -r "${VEIL_PACKAGE_PATH}"
fi
mkdir "${VEIL_PACKAGE_PATH}"

if [ "$VEIL_OS" = "windows" ]; then
  VEIL_EXE="${SRC_BUILD}/${BUILD_ARCH}-${BUILD_OS}/release/bin/Release/veil.exe"
  VEIL_BIN_DIR="${VEIL_PACKAGE_PATH}"
else
  VEIL_EXE="${SRC_BUILD}/${BUILD_ARCH}-${BUILD_OS}/release/bin/veil"
  VEIL_BIN_DIR="${VEIL_PACKAGE_PATH}/bin"
  mkdir "${VEIL_BIN_DIR}"
fi

if [ ! -f "${VEIL_EXE}" ]; then
  echo "no executable found in build directory."
  rm -r "${VEIL_PACKAGE_PATH}"
  exit 1
fi

cp "${VEIL_EXE}" "${VEIL_BIN_DIR}"
cp "${SCRIPT_DIR}/../LICENSE" "${VEIL_PACKAGE_PATH}/LICENSE"
cp "${SCRIPT_DIR}/../NOTICE" "${VEIL_PACKAGE_PATH}/NOTICE"

if [ "$VEIL_OS" = "windows" ]; then
  (cd "${SRC_PACKAGE}" && 7z a -r -tzip "${VEIL_PACKAGE_NAME}.zip" "${VEIL_PACKAGE_NAME}")
else
  (cd "${SRC_PACKAGE}" && tar -czf "${VEIL_PACKAGE_NAME}.tgz" "${VEIL_PACKAGE_NAME}")
fi

rm -r "${VEIL_PACKAGE_PATH}"
