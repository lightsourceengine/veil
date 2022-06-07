#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

cd "${SCRIPT_DIR}" || exit 1

case "$OSTYPE" in
  darwin*)  OSNAME=darwin ;;
  linux*)   OSNAME=linux ;;
  msys*)    OSNAME=windows ;;
  *) OSNAME=UNKNOWN
esac

TAG=${1:-x86_64-$OSNAME}

if [[ -f "../build/${TAG}/release/bin/veil" ]]; then
  VEIL="../build/${TAG}/release/bin/veil"
elif [[ -f "../build/${TAG}/release/bin/Release/veil.exe" ]]; then
  VEIL="../build/${TAG}/release/bin/Release/veil.exe"
else
  echo "veil executable not built"
  exit 1
fi

run_test_suite () {
  $VEIL "$1" >/dev/null

  if [ $? -eq 0 ]; then
    echo "$1: PASSED"
  else
    echo "$1: FAIL"
    exit 1
  fi
}

run_fail_test_suite () {
  $VEIL "$1" > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo "$1: FAIL"
    exit 1
  else
    echo "$1: PASSED ($?)"
  fi
}

echo "API Tests"
for F in api/*.mjs ; do run_test_suite "$F" ; done

echo
echo "Run Tests"
for F in pass/*.mjs ; do run_test_suite "$F" ; done

echo
echo "Run Failure Tests"
for F in fail/*.mjs ; do run_fail_test_suite "$F" ; done

echo
echo "All tests passed."

exit 0
