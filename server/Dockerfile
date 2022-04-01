# Pull Docker Hub base image
FROM node:14.16.0-alpine3.10
# Set working directory
WORKDIR /usr/app
ENV PATH /app/node_modules/.bin:$PATH
# Install app dependencies
COPY package*.json ./
RUN npm ci --silent
# Copy app to container
COPY . .
# Run the "build" script in package.json
RUN npx prisma generate
RUN npm run build
EXPOSE 3001
# CMD ["node", "dist/src/app.js"]