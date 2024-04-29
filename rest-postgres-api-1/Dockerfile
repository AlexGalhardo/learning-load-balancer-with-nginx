# Dockerfile for Express REST API app

# Use official Node.js image as base
FROM node:20

# Set working directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# COPY .env.example .
# COPY setup.sh .

RUN cp .env.example .env
RUN ./setup.sh

# Expose port
EXPOSE 3333

# Command to run the app
CMD ["npm", "run", "dev"]