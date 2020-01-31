#!/bin/bash

set -eE

function cleanup() {
  if [ -n "$SERVER_PID" ]; then kill $SERVER_PID; fi
  rm -Rf assets
}

trap cleanup EXIT
trap cleanup ERR

yarn webpack
python -m http.server 8000 &
SERVER_PID=$!

xvfb-run -a pytest --ignore=node_modules -s
