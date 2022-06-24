#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

SRC_BUILD="${SCRIPT_DIR}/../build"
SRC_PACKAGE="${SRC_BUILD}/package"

BUILD_TAG=$1
PACKAGE_TAG=$2

if [ "${1}x" = "x" ]; then
  case "$OSTYPE" in
    darwin*)
      BUILD_TAG=x86_64-darwin
      PACKAGE_TAG=macos-x64
    ;;
    linux*)
      BUILD_TAG=x86_64-linux
      PACKAGE_TAG=linux-x64
    ;;
    msys*)
      BUILD_TAG=x86_64-windows
      PACKAGE_TAG=windows-x64
    ;;
    *)
      echo "create-package.sh build_tag package_tag"
      echo "Error: missing build_tag"
      exit 1
    ;;
  esac
fi

if [ "${PACKAGE_TAG}x" = "x" ]; then
  echo "create-package.sh build_tag package_tag"
  echo "Error: missing package_tag"
  exit 1
fi

VEIL_VERSION="1.2.0"
VEIL_BUILD_PATH="${SRC_BUILD:?}/${BUILD_TAG}/release"
VEIL_PACKAGE_NAME="veil-${VEIL_VERSION}-${PACKAGE_TAG}"
VEIL_PACKAGE_PATH="${SRC_PACKAGE:?}/${VEIL_PACKAGE_NAME}"

VEIL_WIN_EXE="${VEIL_BUILD_PATH}/bin/Release/veil.exe"

if [ ! -d "${SRC_PACKAGE:?}" ]; then
  mkdir "${SRC_PACKAGE:?}"
fi

if [ -d "${VEIL_PACKAGE_PATH}" ]; then
  rm -r "${VEIL_PACKAGE_PATH}"
fi
mkdir "${VEIL_PACKAGE_PATH}"

if [ -f "${VEIL_WIN_EXE}" ]; then
  VEIL_EXE="${VEIL_WIN_EXE}"
  VEIL_BIN_DIR="${VEIL_PACKAGE_PATH}"
else
  VEIL_EXE="${VEIL_BUILD_PATH}/bin/veil"
  VEIL_BIN_DIR="${VEIL_PACKAGE_PATH}/bin"
  mkdir "${VEIL_BIN_DIR}"
fi

if [ ! -f "${VEIL_EXE}" ]; then
  echo "no executable found in build directory: ${VEIL_EXE}"
  rm -r "${VEIL_PACKAGE_PATH}"
  exit 1
fi

cp "${VEIL_EXE}" "${VEIL_BIN_DIR}"
cp "${SCRIPT_DIR}/../LICENSE" "${VEIL_PACKAGE_PATH}/LICENSE"

if [ -f "${VEIL_WIN_EXE}" ]; then
  (cd "${SRC_PACKAGE}" && 7z a -r -tzip "${VEIL_PACKAGE_NAME}.zip" "${VEIL_PACKAGE_NAME}")
else
  (cd "${SRC_PACKAGE}" && tar -czf "${VEIL_PACKAGE_NAME}.tgz" "${VEIL_PACKAGE_NAME}")
fi

rm -r "${VEIL_PACKAGE_PATH}"
