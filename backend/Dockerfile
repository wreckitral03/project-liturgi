# Use official lightweight Node image
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build if needed (adjust if you have build step)
# RUN pnpm build

EXPOSE 3000

# Start backend
CMD ["pnpm", "start"] 
# or if you use "start:prod": CMD ["pnpm", "run", "start:prod"]