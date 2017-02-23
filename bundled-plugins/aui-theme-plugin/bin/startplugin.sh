#!/bin/bash


BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd $BIN_DIR/..

# Run it in dev mode
exec docker-compose up --build
