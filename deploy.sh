#!/usr/bin/env bash

# Get the commit message from all arguments after the script name
commit_message="${@:1}"

# Add all files to Git
git add .

# Commit the changes with the provided message
git commit -m "$commit_message"

# Check if package.json exists
if [ -f "package.json" ]; then
  # Bump the minor patch version of the NPM package
  npm version patch

  # Publish the package
  npm publish
else
  echo "No package.json found. Skipping NPM commands."
fi

# Check if the origin exists
if git ls-remote --exit-code origin > /dev/null 2>&1; then
  # Push the changes to the origin Git repository
  git push origin HEAD
else
  echo "No origin found. Skipping push to origin."
fi
