# athena

A modular backend framework for those who like the latest runtimes. (Also aims to provide a stable, sane API - all very much WIP.)

The functioning, older version of this project (`typeorm`, `express`, etc) is in the [`main`](https://github.com/aldahick/athena/tree/main) branch (for now).

## Features

- [GraphQL](https://graphql.org/)
- It's all [ES modules](https://nodejs.org/api/esm.html)!

### To Do

- [x] GraphQL
- [ ] ORM
- [ ] CI
- [ ] CD

## Usage

Install dependencies:

```sh
npm install --save @athenajs/core reflect-metadata
npm install --save-dev @types/node typescript
```

Make sure your tsconfig has `experimentalDecorators: true` and `emitDecoratorMetadata: true`.

Instantiate and start the server (using ES modules, not CommonJS):

```typescript
import { container, Application, Config } from "@athenajs/core";
import { Config } from "./config.js";

async function main() {
  container.register(BaseConfig, Config);
  const app = container.resolve(Application);
  await app.start();
}

await main();
```

Since Athena relies on dependency injection rather heavily, you accomplish configuration by extending `BaseConfig`. The following code is the same `./config.js` imported above. (Note the additional dependency on `@athenajs/utils`, for convenience's sake.)

```typescript
import { BaseConfig, injectable } from "@athenajs/core";
import { getModuleDir } from "@athenajs/utils";
import { resolve } from "path";

@injectable()
export class Config extends BaseConfig {
  // for example, to specify the directories containing your GraphQL schema, override like so:
  readonly graphqlSchemaDirs = [resolve(getModuleDir(import.meta), '../schema')];
}
```

It's simple to inject dependencies into constructors, thanks to [`tsyringe`](https://npmjs.com/package/tsyringe). Writing resolvers is just as straightforward:

```typescript
/**
 * resolves for the following schema:
 * type Query {
 *   hello: String!
 * }
 */
import { resolver } from "@athenajs/core";

@resolver()
export class HelloResolver {
  @resolveQuery()
  async hello(): Promise<string> {
    return "Hello, world!";
  }

  // If you don't want to name your methods after the fields they resolve, don't!
  @resolveField("Query.hello")
  async resolveHello(): Promise<string> {
    return "Hello, resolved world!";
  }
}
```

See the [demo](./packages/demo) package for a complete example.

## Development

We use the [Node test runner](https://nodejs.org/api/test.html#running-tests-from-the-command-line), so make sure to install Node.JS v18.13 / v19.2 or higher.
