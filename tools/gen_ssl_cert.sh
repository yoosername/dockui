#!/bin/sh

# For dev, Use defaults except Common Name which should enter 'localhost'
openssl req \
        -nodes \
        -new \
        -x509 \
        -keyout /tmp/dockui.server.key \
        -out /tmp/dockui.server.cert \
        -subj "/C=GB/ST=Narnia/L=Narnia/O=Dockui/OU=Dev Dept/CN=localhost"