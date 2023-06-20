ARG SKIP_PREFLIGHT_CHECK
ARG REACT_APP_VERSION
ARG REACT_APP_API_URL
ARG REACT_APP_API_URL_PROD
# build environment
# Pull Docker Hub base image
FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
ARG SKIP_PREFLIGHT_CHECK
ARG REACT_APP_VERSION
ARG REACT_APP_API_URL
ARG REACT_APP_API_URL_PROD
ENV PATH /app/node_modules/.bin:$PATH
ENV SKIP_PREFLIGHT_CHECK=${SKIP_PREFLIGHT_CHECK}
ENV REACT_APP_VERSION=${REACT_APP_VERSION}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_API_URL_PROD=${REACT_APP_API_URL_PROD}
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