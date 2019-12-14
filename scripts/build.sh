#!/bin/bash
cd $(dirname ${0})
cd ..
set -o verbose

BABEL=./node_modules/.bin/babel
BROWSERIFY=./node_modules/.bin/browserify

# Rebuild dependencies for Electron
./node_modules/.bin/electron-rebuild

# Transpile all JS to less-modern JS
${BABEL} src/ --out-dir build/ --quiet

# Package all JS into one file
${BROWSERIFY} build/app.js -o bundle.js






