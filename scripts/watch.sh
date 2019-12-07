#!/bin/bash
cd $(dirname ${0})
cd ..

WATCH=./node_modules/.bin/watch

${WATCH} ./scripts/build.sh src/

