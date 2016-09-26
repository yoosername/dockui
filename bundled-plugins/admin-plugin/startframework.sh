#!/bin/bash

NETWORK_NAME=framework

if docker network ls -f name=$NETWORK_NAME | sed -n '1!p' ; then
    echo "$NETWORK_NAME network exists, proceeding"
else
    echo "$NETWORK_NAME network doesnt exist, create it"
    docker network create $NETWORK_NAME
fi

docker-compose -f compose-framework.yml rm -f
exec docker-compose -f compose-framework.yml up
