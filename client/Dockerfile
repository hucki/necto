# build environment
# Pull Docker Hub base image
FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# Install app dependencies
COPY package*.json ./
RUN npm ci
# Copy app to container
COPY . ./
# Run the "build" script in package.json
RUN npm run build

#production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html