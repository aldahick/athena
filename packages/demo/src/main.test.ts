import assert from "node:assert";
import { randomInt } from "node:crypto";
import { describe, it } from "node:test";

import { Application, container } from "@athenajs/core";

import { main } from "./main.js";

export const withTestApp = async (
  callback: (url: string, app: Application) => Promise<void>,
) => {
  const port = randomInt(16384, 65536).toString();
  process.env.HTTP_PORT = port;
  const app = await main();
  try {
    await callback(`http://localhost:${port}`, app);
  } finally {
    await app.stop();
    container.clearInstances();
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
