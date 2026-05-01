FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm@10.10.0

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build 

EXPOSE 8080

CMD ["pnpm", "exec", "expo", "start", "--web", "--host", "lan", "--port", "8080"]
