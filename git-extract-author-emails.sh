#!/bin/bash

if [[ ! -d ".git" ]]; then
  echo "Not a Git Directory"
fi

git --no-pager log |
  grep --regexp='^Author: *' |
  grep -o --regexp='<.*>' |
  sed 's/[<|>]//g' |
  sort -u |
  uniq -u
