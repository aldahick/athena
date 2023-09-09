# @athenajs/react-utils

Includes a Dockerfile to serve your Vite-built React app, using [`pnpm`](https://pnpm.io/). It enables environment variable interpolation at container creation, instead of when the React app (and/or Docker image) is built. All you have to do is refer to the Dockerfile: `docker build -f node_modules/@athenajs/react-utils/Dockerfile`

Make sure to include a `.env.example` file, from which environment variables are inferred and provided in the React app as body attributes. `getConfigFromAttributes()` provides access to the values at runtime.
