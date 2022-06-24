# HOST: Linux x86_64, Ubuntu 18.0.4
set(CMAKE_SYSTEM_NAME Linux)
# TARGET_BOARD setting will decide ARM version v6 or v7
set(CMAKE_SYSTEM_PROCESSOR arm)
# Raspberry Pi crosstools gcc. Assumes that arm-rpi-linux-gnueabihf-gcc is in PATH. Download from LSE ci repo.
set(CMAKE_C_COMPILER arm-rpi-linux-gnueabihf-gcc)
set(CMAKE_C_COMPILER_WORKS TRUE)
