#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

SOURCE_ROOT="${SCRIPT_DIR}/.."

BUILD_TAG=$1
PACKAGE_TAG=$2
BUILD_TYPE=$3

if [[ "${BUILD_TAG}x" == "x" ]]; then
  echo "create-package.sh build_tag package_tag [build_type]"
  echo "Error: missing build_tag"
  exit 1
fi

if [[ "${PACKAGE_TAG}" == "default" ]]; then
  case "${BUILD_TAG}" in
    x86_64-darwin)
      PACKAGE_TAG=macos-x64
      ;;
    x86_64-linux)
      PACKAGE_TAG=linux-x64
      ;;
    x86_64-windows)
      PACKAGE_TAG=windows-x64
      ;;
    *)
      echo "Error: No default for build_tag = '${BUILD_TAG}'"
      ;;
  esac
fi

if [[ "${PACKAGE_TAG}x" == "x" ]]; then
  echo "create-package.sh build_tag package_tag [build_type]"
  echo "Error: missing package_tag"
  exit 1
fi

if [[ "${BUILD_TYPE}x" == "x" ]]; then
  BUILD_TYPE="release"
fi

if [[ "${BUILD_TYPE}" != "release" ]] && [[ "${BUILD_TYPE}" != "debug" ]]; then
  echo "create-package.sh build_tag package_tag [build_type]"
  echo "Error: build_type must be 'release' or 'debug'"
  exit 1
fi

VEIL_PACKAGE_NAME="veil-v$(cat config/version)-${PACKAGE_TAG}"

cd "${SOURCE_ROOT}"
mkdir -p build/package
# Copy license to package directory for convenience. The package directory will be the contents of the CI artifact.
cp -f LICENSE "build/package"

echo "creating ${VEIL_PACKAGE_NAME}..."

# special case for macos plus size binary
if [[ "${BUILD_TAG}" == "macos" ]]; then
  MACOS_VEIL=build/macos/release/bin/veil
  MACOS_ARM64_VEIL=build/arm64-darwin/release/bin/veil
  MACOS_X64_VEIL=build/x86_64-darwin/release/bin/veil

  # clean the build directory
  mkdir -p "$(dirname ${MACOS_VEIL})"
  rm -f "${MACOS_VEIL}"

  # verify the binaries exist
  lipo -info "${MACOS_ARM64_VEIL}"
  lipo -info "${MACOS_X64_VEIL}"

  # merge
  lipo "${MACOS_ARM64_VEIL}" "${MACOS_X64_VEIL}" -create -output "${MACOS_VEIL}"
fi

if [[ "${PACKAGE_TAG}" == *"windows"* ]]; then
  VEIL_PACKAGE_FILE="build/package/${VEIL_PACKAGE_NAME}.zip"
  rm -f "${VEIL_PACKAGE_FILE}"
  cd "build/${BUILD_TAG}/release/bin/Release"
  7z a -r -tzip "${SOURCE_ROOT}/${VEIL_PACKAGE_FILE}" veil.exe
else
  VEIL_PACKAGE_FILE="build/package/${VEIL_PACKAGE_NAME}.tgz"
  rm -f "${VEIL_PACKAGE_FILE}"
  tar -czf "${VEIL_PACKAGE_FILE}" -C "build/${BUILD_TAG}/release/bin" veil
fi

echo "finished: ${VEIL_PACKAGE_FILE}"
