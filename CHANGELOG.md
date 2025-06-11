# Athena Changelog

Breaking changes occur in minor versions during 1.x.

Versions before 1.0 (Oct 21, 2023) are not included here - please see the [commit history before that point](https://github.com/aldahick/athena/commits/main/?after=8667f1dae3690173a398e58f3b4e100942adfc1e+0) if you're curious.

## v1.4.0

- **Breaking** Change second arg of `ContextGenerator.websocketContext` to `graphql-ws/SubscribePayload`
- Update dependencies

## v1.3.3

- Update dependencies
- Improve CI performance

## v1.3.2

- Implement subscription resolvers

## v1.3.0

- **Breaking** Update required Node.JS version to 22.x
- Update dependencies

## v1.2.5

- Improve logging
- Improve tooling (Biome)

## v1.2.2

- Improve tooling (Biome, `lint-staged`)
- Update dependencies

## v1.2.1

- Export `injectAll` from tsyringe

## v1.2.0

- **Breaking** Switch from tsyringe singletons to injectables
- Improve tooling (vitest)
- Reduce published package size

## v1.1.3

- Update all dependencies

## v1.1.0

- **Breaking** Update required Node.JS version to 20.x

## v1.0.1

- Add `LoggerOptions.pretty`

## v1.0.0

- Full release of core, react-utils, and utils.
- Supports GraphQL and HTTP handlers.
