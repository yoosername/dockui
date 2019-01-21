#!/bin/bash

JSON="\nmodule.exports = {\n"
CONSTS=""

for FILE in $(find ./src -type f | grep .js | grep -v spec | sort)
do
    DIR=$(dirname $FILE)
    NAME=$(basename $FILE | awk -F. '{print $1}')
    JSON="     ${JSON}${NAME},\n"
    CONSTS="$CONSTS\nconst ${NAME} = require(\"${DIR}/$NAME\");"
done

CONSTS=$(echo -e $CONSTS | sort)
echo "${CONSTS/; /;\n}"

JSON="$JSON}"
echo
echo -e ${JSON}