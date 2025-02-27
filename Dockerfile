# Use node for building
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the SvelteKit app
RUN npm run build

# Use lightweight Nginx to serve static files
FROM nginx:alpine

# Copy built files to Nginx public directory
COPY . .

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
