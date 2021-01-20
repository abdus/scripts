#!/bin/bash

if [ ! $1 ]; then
  exit 1
fi

COMMIT_LOG="$(git --no-pager log --oneline $1)"

echo "$COMMIT_LOG" | while read line; do
  echo -e "$2        --> $line"
done
