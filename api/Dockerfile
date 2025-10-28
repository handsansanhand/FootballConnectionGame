# Use an official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies (only production deps if NODE_ENV=production)
RUN npm install --omit=dev

# Copy the rest of your source code
COPY . .

# Set environment variables (optional defaults)
ENV PORT=3030

# Expose port for external access
EXPOSE 3030

# Start the API
CMD ["npm", "start"]
