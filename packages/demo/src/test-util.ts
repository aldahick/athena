import { randomInt } from "node:crypto";
import { container } from "@athenajs/core";
import { GraphQLClient } from "graphql-request";
import { Sdk, getSdk } from "./graphql-sdk.js";
import { main } from "./main.js";
import "./graphql.js";

export const withTestApp = async (
  callback: (sdk: Sdk, url: string) => Promise<void>,
) => {
  const port = randomInt(16384, 65536).toString();
  process.env.HTTP_PORT = port;
  const app = await main();
  const url = `http://localhost:${port}`;
  try {
    await callback(getSdk(new GraphQLClient(`${url}/graphql`)), url);
  } finally {
    await app.stop();
    container.clearInstances();
  }
};
