# Stage 1: Build the Vite React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# Force dev dependencies even if GCR sets NODE_ENV=production
RUN npm install --include=dev

# Increase Node memory limit for the TypeScript compiler
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx template which automatically parses env variables on startup
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default Cloud Run port
ENV PORT 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
