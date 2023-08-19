import assert from "node:assert";
import { randomInt } from "node:crypto";
import { describe, it } from "node:test";

import { Application } from "@athenajs/core";

import { Config } from "./config.js";
import { main } from "./main.js";

export const withTestApp = async (
  callback: (url: string, app: Application) => Promise<void>,
) => {
  process.env.HTTP_PORT =
    process.env.HTTP_PORT ?? randomInt(16384, 65536).toString();
  const config = new Config();
  const app = await main();
  try {
    await callback(`http://localhost:${config.http.port}`, app);
  } finally {
    await app.stop();
  }
};

describe("main", () => {
  it("should start a working GraphQL server", async () => {
    await withTestApp(async (url) => {
      const res = await fetch(`${url}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: "query { hello }" }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json());
      assert.deepStrictEqual(res, { data: { hello: "hello, world!" } });
    });
  });
});
