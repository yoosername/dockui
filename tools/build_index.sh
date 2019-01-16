#!/bin/bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
JSON="\nmodule.exports = {\n"

for FILE in $(find ${THISDIR}/../src -type f | grep .js | grep -v spec)
do
    DIR=$(dirname $FILE)
    NAME=$(basename $FILE | awk -F. '{print $1}')
    JSON="     ${JSON}${NAME},\n"
    echo "const ${NAME} = require(\"${DIR}/$NAME\");"
done

JSON="$JSON}"
echo
echo -e ${JSON}