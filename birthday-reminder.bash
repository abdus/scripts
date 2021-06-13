#!/bin/bash

FILE=$1 # location of the file containing birthdays in format: NAME   DATE (in YYYY/MM/DD)
TODAY=$(date +"%Y-%m-%d")

if [[ ! -f $FILE ]]; then
  echo "you must provide a file containing birthdays"
  exit 1
fi

# clean the file. anything that starts with a # should be considered as a
# comment. also delete empty lines
FILE_CONTENT=$(sed 's/#.*$//g' $FILE | sed '/^\ *$/d')

# check if today is the birth-day
echo -e "$FILE_CONTENT" | while read LINE; do
  P_NAME=$(echo $LINE | grep -oE '[a-zA-Z]*')
  B_DATE=$(echo $LINE | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')

  if [[ $B_DATE == $TODAY ]]; then
    # TODO: send a reminder
    echo Birthday Alert: $P_NAME on $B_DATE > birthday_reminder
  fi
done
