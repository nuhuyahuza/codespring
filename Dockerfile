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

# Development stage for frontend
FROM node:20-alpine AS frontend-dev
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 5173
CMD ["yarn", "client"]

# Development stage for backend
FROM node:20-alpine AS backend-dev
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY server .
RUN mkdir -p uploads
EXPOSE 3000
CMD ["yarn", "server"]

# Production stage for frontend
FROM node:20-alpine AS frontend-prod
WORKDIR /app
COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/package.json ./
RUN yarn install --frozen-lockfile --production
EXPOSE 5173
CMD ["yarn", "preview"]

# Production stage for backend
FROM node:20-alpine AS backend-prod
WORKDIR /app
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/package.json ./
COPY --from=backend-builder /app/prisma ./prisma
RUN yarn install --frozen-lockfile --production
RUN mkdir -p uploads
RUN npx prisma generate
EXPOSE 3000
CMD ["yarn", "start"]

# Copy startup script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/index.js"] 