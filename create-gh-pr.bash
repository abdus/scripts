#!/bin/bash

# creates a github PR url with pre-filled details
# requirements: 
#   1. jq
#   2. git
#   3. wl-clipboard (optional)

set -e

# check if the folder is a git repo. if not exit
if [ ! -d .git ]; then
  echo "Not a git repo"
  exit 1
fi

target_branch="dev"

# assignees
assignees="" # enter github usernames in csv

# get the current branch name
branch_name=$(git rev-parse --abbrev-ref HEAD)

# get the git commits with short commit id and commit description between
# target_branch and current branch
git log --pretty=format:"%h %s" $target_branch..HEAD > /tmp/pr-body-commit

# replace commit ids with `commit id` (commit id being the commit)
sed -i 's/\([a-z0-9]*\) /`\1` /' /tmp/pr-body-commit

# add serial numbers before each line
awk '{print NR". "$0}' /tmp/pr-body-commit > /tmp/pr-body

echo "\n\n---\n" >> /tmp/pr-body

# diff the .env.example and add it to the /tmp/pr-body. write (none) if there are none
echo -e "\n\n### Env Changes\n" >> /tmp/pr-body
git --no-pager diff $target_branch:.env.example $branch_name:.env.example || echo "(none)" >> /tmp/pr-body

# get the origin url of the git repo
origin_url=$(git remote get-url origin)

# if it's a ssh url, convert it to http url
if [[ $origin_url == git@* ]]; then
  origin_url=$(echo $origin_url | sed 's/git@/https:\/\//' | sed 's/:/\//')
fi

# remove the .git from the url
origin_url=$(echo $origin_url | sed 's/\.git//')

# get the pr body and url-encode it
pr_body=$(cat /tmp/pr-body | jq -sRr @uri)

# encoded branch name
title=$(echo $branch_name | jq -sRr @uri)

# generate a pr url
pr_url="$origin_url/compare/$target_branch...$branch_name?expand=1&title=$title&body=$pr_body&assignees=$assignees"

echo $pr_url

# comment this out if you are not on wayland. or you dont have wl-clipboard
# installed
echo $pr_url | wl-copy 
