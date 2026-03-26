FROM node:22-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install OpenClaw globally
RUN npm install -g openclaw@latest

# Set working directory
WORKDIR /app

# Set OpenClaw Home
ENV OPENCLAW_HOME=/app/.openclaw
ENV PATH="/usr/local/bin:${PATH}"

# Copy project files
COPY . .

# Grant execution permissions to start script
RUN chmod +x /app/start.sh

# Expose Gateway port
EXPOSE 18789

# Run startup script
CMD ["/app/start.sh"]
