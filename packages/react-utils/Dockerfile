FROM node:18-alpine AS builder

RUN npm i -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY src src
COPY index.html ./
COPY vite.config.ts tsconfig.json tsconfig.node.json .eslintrc.json ./
COPY .env.example ./

RUN pnpm build

FROM node:18-alpine AS server

WORKDIR /app

RUN npm i -g serve
RUN npm i @athenajs/react-utils

COPY --from=builder .env.example ./
COPY --from=builder dist dist

ENV PORT=3000
RUN printf '#!/bin/sh\nset -e\n\
node node_modules/@athenajs/react-utils/dist/config-node.js\n\
serve -s dist -l "tcp://0.0.0.0:$PORT"\n' >> serve.sh

CMD ["sh", "serve.sh"]
