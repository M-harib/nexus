FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Environment
ENV NODE_ENV=development
ENV PYTHONUNBUFFERED=1

# Run application
CMD ["npm", "run", "dev"]
