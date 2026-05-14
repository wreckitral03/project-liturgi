FROM node:18-alpine AS build

WORKDIR /app

RUN npm install -g pnpm@10.10.0

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG EXPO_PUBLIC_API_BASE=http://localhost:3000
ENV EXPO_PUBLIC_API_BASE=$EXPO_PUBLIC_API_BASE

RUN pnpm build:web

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
