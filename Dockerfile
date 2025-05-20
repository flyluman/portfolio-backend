# Use minimal node:22-alpine image
FROM node:23-alpine

# Set work-dir
WORKDIR /portfolio

# Copy package.json
COPY package*.json .

# Install Deps
RUN npm install

# Copy the project
COPY . .

# Run application
CMD ["node", "server.js"]

