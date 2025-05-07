# Build stage for frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Build stage for backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY server .
RUN yarn build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install production dependencies for backend
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built frontend and backend
COPY --from=frontend-builder /app/dist ./public
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"] 