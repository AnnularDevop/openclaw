#!/bin/bash

# Set OPENCLAW_HOME to /app so config ends up in /app/.openclaw
export OPENCLAW_HOME=/app
mkdir -p $OPENCLAW_HOME/.openclaw

# Initialize OpenClaw agents
# Using the absolute paths for agent directories
echo "Adding agents..."
openclaw agents add todo-executor --workspace /app --agent-dir /app/agents/todo-executor --non-interactive
openclaw agents add kara --workspace /app --agent-dir /app/agents/kara --non-interactive
openclaw channels add --channel telegram --token $OPENCLAW_CHANNELS_TELEGRAM_TOKEN
openclaw agents bind --agent kara --bind telegram
openclaw models set google/gemini-flash-latest

# Start the gateway with --allow-unconfigured to bypass initial configuration prompts
echo "Starting gateway..."
openclaw gateway run --allow-unconfigured --bind lan
