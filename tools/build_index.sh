#!/bin/bash

containsElement () {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

JSON="\nmodule.exports = {\n"
CONSTS=""
IGNORE=("absolute-path" "swagger" "spec")
SPREAD_SYNTAX=("Config")
FIND_EXCLUSIONS=$(printf -- '-not -path "*%s*" ' "${IGNORE[@]}")
FIND_CMD="find ./src $FIND_EXCLUSIONS -path \"*.js\" -type f"
echo "running: $FIND_CMD" >&2

for FILE in $(eval $FIND_CMD | sort)
do
    DIR=$(dirname $FILE)
    NAME=$(basename $FILE | awk -F. '{print $1}')
    JSON="     ${JSON}${NAME},\n"
    if $(containsElement "$NAME" "${SPREAD_SYNTAX[@]}"); then
        CONSTS="$CONSTS\nconst {${NAME}} = require(\"${DIR}/$NAME\");"
    else
        CONSTS="$CONSTS\nconst ${NAME} = require(\"${DIR}/$NAME\");"
    fi
done

CONSTS=$(echo -e $CONSTS | sort)
echo "${CONSTS/; /;\n}"

JSON="$JSON}"
echo
echo -e ${JSON}