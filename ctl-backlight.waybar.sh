#!/bin/bash

# Copyright: Abdus S. Azad
#
# control brightness by clicking on brightness handlers in waybar
# checks if the brightness is max; if not, increment by +10%
# else decrease by -10% until it reaches to 0
# do similar when minimum brightness is set
#
# deps:
#   - community/brightnessctl

CURRENT_BRIGHTNESS_VALUE=$(brightnessctl get)
MAX_BRIGHTNESS_VALUE=$(brightnessctl max)
BRIGHTNESS_DELTA=14     # increase decrease it as required

# possible values for $1    up/down

# when there is no flag passed, increase/decrease brightness by maintaining
# some sanity
if [[ -z "$1" ]]; then
  if [[ "$CURRENT_BRIGHTNESS_VALUE" == 0 ]]; then
    touch "/tmp/brightnessctl-waybar.up.lock"
    rm "/tmp/brightnessctl-waybar.down.lock"
  fi

  if [[ "$CURRENT_BRIGHTNESS_VALUE" == "$MAX_BRIGHTNESS_VALUE" ]]; then
    rm "/tmp/brightnessctl-waybar.up.lock"
    touch "/tmp/brightnessctl-waybar.down.lock"
  else
    # set flag to increase brightness
    touch "/tmp/brightnessctl-waybar.up.lock"
  fi

  if [[ -f "/tmp/brightnessctl-waybar.up.lock" ]]; then
    brightnessctl s "+$BRIGHTNESS_DELTA%"
  elif [[ -f "/tmp/brightnessctl-waybar.down.lock" ]]; then
    brightnessctl s "$BRIGHTNESS_DELTA%-"
  fi
else
  if [[ "$1" == "up" ]]; then
    brightnessctl s "+$BRIGHTNESS_DELTA%"
  elif [[ "$1" == "down" ]]; then
    brightnessctl s "$BRIGHTNESS_DELTA%-"
  fi
fi
