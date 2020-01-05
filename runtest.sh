#!/bin/bash

python -m http.server 8000 &
SERVER_PID=$!

pytest -s

kill $SERVER_PID
