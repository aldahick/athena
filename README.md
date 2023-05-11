# athena

A modular backend framework for those who like the latest runtimes. (Also aims to provide a stable, sane API - all very much WIP.)

The functioning, older version of this project (`typeorm`, `express`, etc) is in the [`main`](https://github.com/aldahick/athena/tree/main) branch (for now).

## Checklist

TODO

- [ ] GraphQL
- [ ] ORM
- [ ] CI
- [ ] CD

## Features

- Pluggable server providers ([fastify](./packages/server-fastify), [express](./packages/server-express), [koa](./packages/server-koa))
- It's all [ES modules](https://nodejs.org/api/esm.html)!
- Fun new [Typescript 5.0 decorators](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html) (i.e. [ES decorators](https://github.com/tc39/proposal-decorators))

## Development

We use the [Node test runner](https://nodejs.org/api/test.html#running-tests-from-the-command-line), so make sure to install Node.JS v18.13 / v19.2 or higher.
