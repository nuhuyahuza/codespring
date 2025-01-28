# Deployment Guide

## Environment Variables

Before deploying, ensure you set up the following environment variables in your deployment platform:

### Production Environment
- `VITE_API_URL`: Production API endpoint
- `VITE_WS_URL`: Production WebSocket endpoint
- `VITE_JWT_SECRET`: Production JWT secret
- `VITE_STRIPE_PUBLIC_KEY`: Production Stripe key
- `VITE_CLOUDINARY_CLOUD_NAME`: Production Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Production Cloudinary upload preset

### Development Environment
Use the `.env.example` file as a template to create your local `.env` file.

### Setting up in different environments:

#### Vercel
Add environment variables in your project settings under "Environment Variab

#### Docker
Use docker-compose environment files or docker run with --env-file 