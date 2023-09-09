#!/bin/bash
set -e

tag_prefix="$1"
if [ "$tag_prefix" == "" ]; then
  >&2 echo "Usage: scripts/hooks/postversion.sh <tag-prefix>"
  exit 1
fi

if ! command -v jq; then
  >&2 echo "Error: jq is required. Please install it and re-run this postversion script."
  exit 1
fi

version=$(cat package.json | jq -r '.version')
tag="$tag_prefix-v$version"
commit_message="$tag_prefix@$version"

echo "Committing new git tag: $tag at commit '$commit_message'"
git add package.json
git commit -m "$commit_message"
git tag $tag

git push
git push --tags
