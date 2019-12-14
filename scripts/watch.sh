#!/bin/bash
cd $(dirname ${0})
cd ..
set -o verbose

WATCH=./node_modules/.bin/watch

${WATCH} ./scripts/build.sh src/

