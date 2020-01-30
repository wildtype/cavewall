#!/bin/bash

function cleanup() {
  rm -Rf assets
}

trap cleanup EXIT

yarn webpack
python -m http.server 8000 &
SERVER_PID=$!

pytest --ignore=node_modules -s

kill $SERVER_PID
