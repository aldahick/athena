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

RUN npm i -g serve

COPY --from=builder dist dist

RUN echo -e '#!/bin/sh\
node node_modules/@athenajs/react-utils/dist/config-node.js\
serve -s dist -l 0.0.0.0:\$PORT' > serve.sh
CMD ["sh", "serve.sh"]
