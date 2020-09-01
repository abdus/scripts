# this script is meant to be added in a cronjob
# write unread email count to /tmp/unread-email-count.txt so that waybar module
# would fetch it from there
#
# at the end of the script, run `pkill -RTMIN+2 waybar` so that the waybar
# module gets updated.
#
# this script requires user to turn on less secure apps

# deps:
#   - curl
#   - notify-send
#   - mako
#   - gmail-creds.nogit.sh : stores gmail credentials. should be put into
#                            the same dir as of this script

function init() {
  if [[ -f "$HOME/scripts/gmail-creds.nogit.sh" ]]; then
    source "$HOME/scripts/gmail-creds.nogit.sh"

    if [[ -z "$GMAIL_USERNAME" ]]; then
      notify-send "MAIL CREDENTIALS: username not found" -i cuttlefish
    elif [[ -z "$GMAIL_PASSWORD" ]]; then
      notify-send "MAIL CREDENTIALS: password not found" -i cuttlefish
    else
      message_count=$(curl -u $GMAIL_USERNAME:$GMAIL_PASSWORD --silent "https://mail.google.com/mail/feed/atom" | grep -wo --regexp='<fullcount>[0-9]*</fullcount>' | grep -wo --regexp='[0-9]*')

      if [[ ! -z "$message_count" ]]; then
        echo $message_count >"/tmp/unread-email-count.txt"
        notify-send "$message_count Unread" -i gmail
      else
        echo "ERR" >"/tmp/unread-email-count.txt"
      fi
    fi
  else
    notify-send "FILE ERROR" "Credentials file not found. Checkout \"gmail-unread-messages.sh\" for more info" -i cuttlefish
    echo "ERR" >"/tmp/unread-email-count.txt"
  fi

  pkill -RTMIN+2 waybar # let waybar update the mail module
}

init
kill 0
