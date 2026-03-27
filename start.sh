#!/bin/bash

# If OPENCLAW_HOME is not set, default it to ./.openclaw locally or /app/.openclaw in Docker
if [ -z "$OPENCLAW_HOME" ]; then
    if [ -d "/app" ]; then
        export OPENCLAW_HOME=/app
    else
        export OPENCLAW_HOME=$(pwd)/.openclaw
    fi
fi

mkdir -p "$OPENCLAW_HOME"

echo "Using OPENCLAW_HOME: $OPENCLAW_HOME"

# Start the gateway with --allow-unconfigured to bypass initial configuration prompts
echo "Starting gateway..."
openclaw gateway run --allow-unconfigured --bind lan
