# athena

[![CircleCI](https://circleci.com/gh/aldahick/athena.svg?style=shield)](https://circleci.com/gh/aldahick/athena)
[![NPM](https://img.shields.io/npm/v/@athenajs/core)](https://npmjs.com/package/@athenajs/core)

I'm tired of rebuilding the same architecture over and over for REST & GraphQL APIs. Athena's goal is to consolidate and improve the best practices I try to follow, and make them extensible and reproducible.

The only logic in my server-side codebase should be application-specific business logic.

## Goals

- [x] HTTP controllers
  - Usage: `src/demo/controller`
- [x] GraphQL resolvers
  - Usage: `src/demo/resolver`
- [x] SQL databases
  - Usage: `src/demo/service/database`
- [x] MongoDB databases
  - Usage: `src/demo/service/database`
- [ ] Authentication
- [ ] Authorization
- More, for sure

## Usage

See the demo codebase in `./src/demo`.
