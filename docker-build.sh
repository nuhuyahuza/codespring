#!/bin/bash

# Check if NODE_ENV is set
if [ -z "$NODE_ENV" ]; then
    echo "NODE_ENV is not set. Defaulting to development"
    NODE_ENV="development"
fi

# Build based on environment
if [ "$NODE_ENV" = "production" ]; then
    echo "Building production environment..."
    docker-compose -f docker-compose.prod.yml up --build
else
    echo "Building development environment..."
    docker-compose -f docker-compose.dev.yml up --build
fi 