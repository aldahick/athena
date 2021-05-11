# Changelog

## Versions

### 0.7.3

- Upgraded Mongoose and Typegoose dependencies

### 0.7.2

- Fixed a bug in `ResolverRegistry`

### 0.7.1

- Added `BaseConfigService.uploadLimit`

### 0.7.0

- Switched _back_ from `@hapi/joi` to `joi`
- Upgraded all packages

### 0.6.3

- Changed `RedisService.{sub,pub}Client` to public
- Changed `MongoService.connection` to public
- Audited dependencies

### 0.6.2

- Changed `TypeormService.connection` to public

### 0.6.1

- Fixed `@guard()` usage in controllers

### 0.6.0

- Implemented queue messaging

### 0.5.3

- Made all `BaseConfigService` fields optional

### 0.5.2

- All internal scripts now use Yarn

### 0.5.1

- Fixed misnamed files
- Removed deploy step from CI

### 0.5.0

- Switched to Yarn
- Lots of internal refactoring for new linting rules

### 0.4.5

- Upgraded all dependencies

### 0.4.4

- Bump some dependencies

### 0.4.3

- Changed `Application` to emit `start` and `stop` events

### 0.4.2

- Improved websocket error handling
- Made `WebsocketRegistry.io` public

### 0.4.1

- Implemented websocket data validation

### 0.4.0

- Implemented websocket support

### 0.3.0

- Upgraded to Typescript 3.9.3

### 0.2.4

- Added `BaseConfigService.environment`
- Added `BaseConfigService.inDevelopment`
- Fixed duplicate logging of missing optional `BaseConfigService` environment variables
- Changed `AuthService.verifyToken()` to correctly return `object | undefined`

### 0.2.3

- Allowed resolvers to be properties, not just methods (actually)

### 0.2.2

- Allowed resolvers to be properties, not just methods

### 0.2.1

- Made `ControllerPayload` generic (argument for `AuthContext`)

## 0.2.0

- Implemented authentication & authorization support

### 0.1.1

- Part two of initial implementation (first publish?)

## 0.1.0

- Initial implementation
