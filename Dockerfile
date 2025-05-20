# Use minimal node:22-alpine image
FROM node:23-alpine

# Set work-dir
WORKDIR /home/node/portfolio

# Copy package.json
COPY package*.json ./

# Install Deps
RUN npm install

# Copy the project
COPY . .

# Change Ownership
RUN chown -R node:node /home/node/portfolio

# Drop privilege
USER node

# Run application
CMD ["node", "server.js"]

