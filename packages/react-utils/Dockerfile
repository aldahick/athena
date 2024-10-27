# Make sure to build this image using the root context, not "web" context
FROM node:22-alpine AS builder
ARG WEB_DIR=.

WORKDIR /app
RUN npm i -g pnpm@latest
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ${WEB_DIR}/package.json ${WEB_DIR}/
RUN pnpm install --frozen-lockfile

WORKDIR /app/${WEB_DIR}
COPY ${WEB_DIR}/src src
COPY ${WEB_DIR}/index.html ./
COPY ${WEB_DIR}/vite.config.ts ./
COPY ${WEB_DIR}/tsconfig.json ${WEB_DIR}/tsconfig.node.json ./
COPY ${WEB_DIR}/.env.example ./

RUN pnpm build

FROM node:22-alpine AS server
ARG WEB_DIR=.

WORKDIR /app

RUN npm i -g serve
RUN npm i @athenajs/react-utils

COPY --from=builder /app/${WEB_DIR}/.env.example ./
COPY --from=builder /app/${WEB_DIR}/dist dist

ENV PORT=3000

CMD ["sh", "node_modules/@athenajs/react-utils/scripts/serve.sh"]
