#!/bin/bash
cd $(dirname ${0})
cd ..

BABEL=./node_modules/.bin/babel
BROWSERIFY=./node_modules/.bin/browserify

# Transpile all JS to less-modern JS
${BABEL} src/ --out-dir build/ --quiet

# Package all JS into one file
${BROWSERIFY} build/app.js -o bundle.js


