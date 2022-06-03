#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

cd "${SCRIPT_DIR}" || exit 1

# TODO: make the path cross platform
VEIL="../build/x86_64-darwin/release/bin/veil"

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

exit 0
