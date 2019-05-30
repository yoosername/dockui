#!/bin/bash

# For dev, Use defaults except Common Name which should enter 'localhost' 
openssl req -nodes -new -x509 -keyout server.key -out server.cert