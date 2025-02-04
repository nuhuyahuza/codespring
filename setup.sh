#!/bin/bash

# Create necessary directories
mkdir -p uploads/submissions

# Install dependencies
echo "Installing dependencies..."
yarn install

# Generate Prisma client
echo "Generating Prisma client..."
yarn prisma generate

# Run database migrations
echo "Running database migrations..."
yarn prisma migrate deploy

# Seed the database
echo "Seeding the database..."
yarn db:seed

# Start the application
echo "Starting the application..."
yarn start 


# npx prisma migrate dev --name add_lesson_content_fields
# npx prisma generate
# npx prisma migrate deploy
# npx prisma db seed
