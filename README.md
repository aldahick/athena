# athena

![NPM version badge](https://img.shields.io/npm/v/@athenajs/core)
![Github workflow status badge](https://github.com/aldahick/athena/actions/workflows/build-core.yml/badge.svg)

A modular backend framework atop Apollo and Fastify. Simpler and more opinionated than its inspiration, [Nest](https://nestjs.org).

## Features

- [GraphQL](./docs/graphql.md)
- [ES modules](https://nodejs.org/api/esm.html) all the way down
<!--
- [Database](./docs/database.md) integration(s) (orchid-orm)
- [Authentication](./docs/auth.md#Authentication) and [authorization](./docs/auth.md#Authorization)
-->

### To Do

- [x] [GraphQL](./packages/demo/src/hello/hello-resolver.ts)
  - [x] [Simple batch resolvers](./packages/demo/src/user/user-resolver.ts)
- [x] [HTTP](./packages/demo/src/hello/hello-controller.ts)
- [x] [CI](./.github/workflows/build-package.yml) / [CD](./.github/workflows/publish-package.yml)
- [ ] Auth
  - [ ] JWT
  - [ ] OAuth
- [ ] ORM

## Getting Started

Install dependencies:

```sh
npm install --save @athenajs/core reflect-metadata
npm install --save-dev @types/node typescript
```

Make sure your tsconfig has `"experimentalDecorators": true` and `"emitDecoratorMetadata": true`. To use ES modules, either set `"type": "module"` in your `package.json`, or name your files `.mts` instead of `.ts`.

Instantiate and start the server:

```typescript
import "reflect-metadata";
import { createApp } from "@athenajs/core";
import "./config.js";
import "./hello-resolver.js";

const app = createApp();
await app.start();
```

Since Athena relies on dependency injection rather heavily, you accomplish configuration by extending `BaseConfig`. The following code is the same `./config.js` imported above. (Note the additional dependency on `@athenajs/utils`, for convenience's sake.)

```typescript
import { BaseConfig, config } from "@athenajs/core";
import { getModuleDir } from "@athenajs/utils";
import { resolve } from "path";

@config()
export class Config extends BaseConfig {
  // for example, to specify the directories containing your GQL schema, override like so:
  readonly graphqlSchemaDirs = [resolve(getModuleDir(import.meta), "../schema")];
  // or, for new fields altogether, you can use this.optional & this.required to read/verify environment variables
  readonly databaseUrl: string = this.required("DATABASE_URL");
  readonly environment: string | undefined = this.optional("NODE_ENV");
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
import { Config } from "./config.js";

@resolver()
export class HelloResolver {
  // inject dependencies by including them as constructor params
  constructor(private config: Config) { }

  @resolveQuery()
  async hello(): Promise<string> {
    return "Hello, world!";
  }

  // If you don't want to name your methods after the fields they resolve, don't!
  @resolveField("Query.hello")
  async resolveHello(): Promise<string> {
    return `Hello, resolved world! Running in environment: ${this.config.environment}`;
  }
}
```

See the [demo](./packages/demo) package for a complete example, including HTTP routes.

## Development

We use the [Node test runner](https://nodejs.org/api/test.html#running-tests-from-the-command-line), so make sure to install Node.JS v18.13 / v19.2 or higher.

To publish new versions, run `pnpm version <new-version>` in the appropriate package directory; a new Git tag will be pushed, and the CI will publish the package automatically (see statuses [here](https://github.com/aldahick/athena/actions)).
