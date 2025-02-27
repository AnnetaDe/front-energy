# Stage 1: Build the SvelteKit app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files and build
COPY . .
RUN npm run build

# Stage 2: Run the built SvelteKit app
FROM node:18-alpine
WORKDIR /app

# Copy built app from the previous stage
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules

# Expose frontend port
EXPOSE 3000

# Run the app
CMD ["node", "build"]