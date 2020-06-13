# Changelog

## Versions

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
