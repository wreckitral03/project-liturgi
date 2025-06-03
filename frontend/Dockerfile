FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Build your frontend (adjust this based on your framework)
RUN pnpm build 

EXPOSE 8080

CMD ["pnpm", "start"] 
# or your actual start command, e.g., "pnpm run dev"