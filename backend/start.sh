#!/usr/bin/env bash
set -e

# Railway may run this on a Linux container.
# Install dependencies only if they are missing to keep startup fast.
if [ ! -d "node_modules" ]; then
  npm install
fi

npm start

