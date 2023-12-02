FROM node:20-alpine AS builder

RUN npm i -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY src src
COPY index.html ./
COPY vite.config.ts tsconfig.json tsconfig.node.json .eslintrc.cjs ./
COPY .env.example ./

RUN pnpm build

FROM node:20-alpine AS server

WORKDIR /app

RUN npm i -g serve
RUN npm i @athenajs/react-utils

COPY --from=builder .env.example ./
COPY --from=builder dist dist

ENV PORT=3000

CMD ["sh", "node_modules/@athenajs/react-utils/scripts/serve.sh"]
