#!/bin/bash

# Get the commit message from all arguments after the script name
commit_message="${@:1}"

# Add all files to Git
git add .

# Commit the changes with the provided message
git commit -m "$commit_message"

# Bump the minor patch version of the NPM package
npm version patch

# Push the changes to the origin Git repository
git push origin HEAD

# Publish the package
npm publish

