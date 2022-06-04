#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"

cd "${SCRIPT_DIR}" || exit 1

cd $SCRIPT_DIR
echo "pwd: $(pwd -P)"

case "$OSTYPE" in
  darwin*)  OSNAME=darwin ;;
  linux*)   OSNAME=linux ;;
  msys*)    OSNAME=windows ;;
  *) OSNAME=UNKNOWN
esac

VEIL="../build/${1:-x86_64-$OSNAME}/release/bin/veil"
echo "veil: $VEIL"

run_test_suite () {
  echo "$1"
  $VEIL "$1" >/dev/null

  if [ $? -eq 0 ]; then
    echo "$1: PASSED"
  else
    echo "$1: FAIL"
    exit 1
  fi
}

run_fail_test_suite () {
  echo "$1"
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
