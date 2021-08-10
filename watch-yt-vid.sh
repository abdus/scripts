#!/bin/bash

set -e

# search YouTube using YTDL
# get video title and id
# list them using dmenu
# on selecting an item, play it using MPV

# required software: mpv, youtube-dl, dmenu

function init() {
  SEARCH_QUERY=$1
  SEARCH_RESULT="$(youtube-dl "ytsearch20:$SEARCH_QUERY" --get-id --get-title)"

  FORMATTED_RESULT="$(echo "$SEARCH_RESULT" | xargs -d '\n' -n2)"

  YT_ID="$(echo "$FORMATTED_RESULT" |
    dmenu -l 15 -nb "#282a36" -nf "#fff" -sb \
      "#50fa7b" -sf "#282a36" -fn "Iosevka" -p "play:" |
    grep -oiE '[^ ]+$')"

  mpv "https://youtube.com/watch?v=$YT_ID"
}

init "$@" & disown
exit
