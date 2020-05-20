# athena

[![CircleCI](https://circleci.com/gh/aldahick/athena.svg?style=shield)](https://circleci.com/gh/aldahick/athena)
[![NPM](https://img.shields.io/npm/v/@athenajs/core)](https://npmjs.com/package/@athenajs/core)

I'm tired of rebuilding the same architecture over and over for REST & GraphQL APIs. Athena's goal is to consolidate and improve the best practices I try to follow, and make them extensible and reproducible.

The only logic in my server-side codebase should be application-specific business logic.

[Here's the changelog.](https://github.com/aldahick/athena/tree/master/CHANGELOG.md)

## Goals

- [x] HTTP controllers
  - Usage: [`src/demo/controller`](https://github.com/aldahick/athena/tree/master/src/demo/controller)
- [x] GraphQL resolvers
  - Usage: [`src/demo/resolver`](https://github.com/aldahick/athena/tree/master/src/demo/resolver)
- [x] SQL databases
  - Usage: [`src/demo/service/database`](https://github.com/aldahick/athena/tree/master/src/demo/service/database)
- [x] MongoDB databases
  - Usage: [`src/demo/service/database`](https://github.com/aldahick/athena/tree/master/src/demo/service/database)
- [x] Authentication
  - Usage: [`src/demo/manager/auth`](https://github.com/aldahick/athena/tree/master/src/demo/manager/auth)
- [x] Authorization
  - Usage:
    - [`src/demo/manager/auth`](https://github.com/aldahick/athena/tree/master/src/demo/manager/auth)
    - [`src/demo/resolver/role.resolver.ts`](https://github.com/aldahick/athena/tree/master/src/demo/resolver/role.resolver.ts)
- More, for sure

## Usage

See the demo codebase in `src/demo`. (Pay attention to `src/demo/index.ts`, which initializes everything!)
