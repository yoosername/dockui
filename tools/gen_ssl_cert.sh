#!/bin/sh

# For dev, Use defaults except Common Name which should enter 'localhost'
mkdir -p ~/dockui/certs
openssl req \
        -nodes \
        -new \
        -x509 \
        -keyout /tmp/dockui/certs/server.key \
        -out /tmp/dockui/certs/server.cert \
        -subj "/C=GB/ST=Narnia/L=Narnia/O=Dockui/OU=Dev Dept/CN=localhost"