# HOST: Linux x86_64, Ubuntu 18.0.4
set(CMAKE_SYSTEM_NAME Linux)
# TARGET_BOARD setting will decide ARM version v6 or v7
set(CMAKE_SYSTEM_PROCESSOR arm)
# Assumes arm-linux-gnueabihf-gcc has been installed by package manager, and the executable is in PATH.
set(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc)
set(CMAKE_C_COMPILER_WORKS TRUE)
