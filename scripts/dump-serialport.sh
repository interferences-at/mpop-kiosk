#!/bin/bash

SERIALPORT=/dev/ttyUSB0

# Set it to 8-N-1
# one start bit, eight (8) data bits, no (N) parity bit, and one (1) stop bit.
# You must be in group dialout

stty -F ${SERIALPORT} 9600 cs8 -cstopb -parenb
tail -f ${SERIALPORT}

