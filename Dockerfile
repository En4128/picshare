# Step 1: Use an official Node.js image as the base
# We choose the alpine version because it is very lightweight and secure.
FROM node:20-alpine

# Step 2: Set the working directory inside the container
# All subsequent instructions will run inside this folder.
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
# By copying these files first, Docker can cache the installed dependencies.
# If you don't change package.json, Docker skips running npm install on rebuilds.
COPY package*.json ./

# Step 4: Install the project dependencies
# 'npm ci' is like 'npm install' but optimized for automated environments like Docker.
RUN npm ci

# Step 5: Copy all the remaining project files into the container
COPY . .

# Step 6: Build the project for production
# This creates a 'dist' directory with optimized static assets.
RUN npm run build

# Step 7: Expose the port that the app runs on
# Vite's preview server uses port 4173 by default.
EXPOSE 4173

# Step 8: Define the command to start the application
# We run Vite's preview command to serve the built 'dist' files.
# The '--host' flag is necessary so the container accepts connections from outside.
CMD ["npm", "run", "preview", "--", "--host"]
