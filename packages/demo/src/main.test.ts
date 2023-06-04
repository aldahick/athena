import assert from "node:assert";
import { describe, it } from "node:test";

import { container } from "@athenajs/core";

import { Config } from "./config.js";
import { main } from "./main.js";

describe("main", () => {
  it("should start a working GraphQL server", async () => {
    const config = container.resolve(Config);
    const app = await main();
    try {
      const res = await fetch(`http://localhost:${config.http.port}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: "query { hello }" }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((r) => r.json());
      assert.deepStrictEqual(res, { data: { hello: "hello, world!" } });
    } finally {
      await app.stop();
    }
  });
});
