#!/bin/bash

# script credit: https://unix.stackexchange.com/a/324123

SIG=1
SIG0=$SIG
while [ $SIG != 0 ]; do
  while [ $SIG = $SIG0 ]; do
    find ~/Public -type f | xargs stat >/tmp/mergedfile
    SIG=$(cat /tmp/mergedfile | md5sum | cut -c1-32)
    sleep 1
  done
  SIG0=$SIG

  if [[ $SSH_CRED ]]; then
    echo 'syncing files with server...'
    cd ~/Public
    rsync -avhL --delete ./ -e ssh $SSH_CRED:/var/www/public.abdus.net/html/
  fi

done
