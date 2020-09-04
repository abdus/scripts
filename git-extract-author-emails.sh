#!/bin/bash

git --no-pager log |
  awk '/^Author.*</ {print $4}' |
  grep -o --regexp='[^<].*[^>]' |
  sed -n 'G; s/\n/&&/; /^\([ -~]*\n\).*\n\1/d; s/\n//; h; P'
