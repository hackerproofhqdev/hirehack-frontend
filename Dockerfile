# Use a specific Node.js version to ensure compatibility with the application
FROM node:22.9.0-slim

# Define ARG for Backend URL, can be overridden at build time
ARG URL=https://backend.thankfulglacier-dc4b0b83.eastus.azurecontainerapps.io
ARG APP_URL=https://hirehack.thankfulglacier-dc4b0b83.eastus.azurecontainerapps.io

# Set the working directory for the application
WORKDIR /app

# Copy package.json and package-lock.json for more efficient layer caching
# This helps avoid reinstalling dependencies unless the package files change
COPY package*.json ./

# Install application dependencies, including legacy peer dependencies if needed
RUN npm install --legacy-peer-deps

# Copy the rest of the application code into the container
COPY . /app/

# Set the environment variables for production environment
# This ensures the app runs in production mode
ENV NODE_ENV=production
ENV BACKEND_URL=${URL}
ENV NEXT_PUBLIC_BACKEND_URL=${URL}
ENV APP_URL=${APP_URL}
ENV NEXT_PUBLIC_LANGCHAIN_URI=https://hirehack-b49c5e7f36fe5631b34429c55847436f.us.langgraph.app
ENV NEXT_PUBLIC_LANGCHAIN_API_KEY=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

# Build the application for production
RUN npm run build

# Expose the application port (usually 3000, replace if needed)
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start"]
