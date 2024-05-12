import assert from "node:assert";
import { describe, it } from "node:test";
import { withTestApp } from "./test-util.js";

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
