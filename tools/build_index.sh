#!/bin/bash

JSON="\nmodule.exports = {\n"

for FILE in $(find ./src -type f | grep .js | grep -v spec)
do
    DIR=$(dirname $FILE)
    NAME=$(basename $FILE | awk -F. '{print $1}')
    JSON="     ${JSON}${NAME},\n"
    echo "const ${NAME} = require(\"${DIR}/$NAME\");"
done

JSON="$JSON}"
echo
echo -e ${JSON}