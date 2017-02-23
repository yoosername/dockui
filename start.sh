#!/bin/bash

NETWORK_NAME=framework
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
pushd $BIN_DIR

if docker network ls -f name=$NETWORK_NAME | sed -n '1!p' ; then
    echo "$NETWORK_NAME network exists, proceeding"
else
    echo "$NETWORK_NAME network doesnt exist, create it"
    docker network create $NETWORK_NAME
fi

# Run it in dev mode
exec docker-compose up --build --force-recreate
