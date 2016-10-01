#!/bin/bash

# Rebuild it
docker-compose -f compose-plugin.yml build

# Run it in dev mode
exec docker-compose -f compose-plugin.yml up
