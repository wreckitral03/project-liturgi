# Use official lightweight Node image
FROM node:18-alpine

WORKDIR /app

# Install the pnpm version used by this lockfile
RUN npm install -g pnpm@10.10.0

# Copy package.json and pnpm lockfile
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Prisma generate runs during install/build and needs this variable present.
# docker-compose overrides it at runtime for the backend service.
ENV DATABASE_URL="postgresql://youruser:yourpassword@db:5432/yourdb?schema=public"

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

RUN pnpm build

EXPOSE 3000

# Start backend
CMD ["pnpm", "start"] 
# or if you use "start:prod": CMD ["pnpm", "run", "start:prod"]
