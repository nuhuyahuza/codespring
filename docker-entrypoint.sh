#!/bin/sh
set -e

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
while ! nc -z db 3306; do
  sleep 1
done
echo "MySQL is ready!"

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Start the application
echo "Starting the application..."
exec "$@" 