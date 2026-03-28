#!/bin/sh

# Line below makes sure that the file is created in the right location
FILE="/usr/share/nginx/html/env-config.js"

echo "window._env_ = {" > $FILE

# Read each environment variable starting with VITE_ and add it to the window._env_ object
# If you have specific ones you want to include, you can list them here manually too
# We'll use printenv to list them all and filter for those starting with VITE_
printenv | grep '^VITE_' | while read -r line; do
  # Extract key and value
  key=$(echo "$line" | cut -d '=' -f 1)
  value=$(echo "$line" | cut -d '=' -f 2-)
  # Append to file
  echo "  $key: \"$value\"," >> $FILE
done

echo "};" >> $FILE

# Continue to Nginx command
exec "$@"
