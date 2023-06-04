import assert from "node:assert";
import { describe, it } from "node:test";

import { recursiveReaddir } from "@athenajs/utils";

import { Config } from "./config.js";

describe("config", () => {
  const config = new Config();
  describe("#graphqlSchemaDirs", () => {
    it("should point to a dir containing graphql files", async () => {
      const files = (
        await Promise.all(
          config.graphqlSchemaDirs.map((dir) => recursiveReaddir(dir))
        )
      ).flat();
      assert.strictEqual(files.length > 0, true);
      assert.strictEqual(
        files.every((f) => f.endsWith(".gql")),
        true
      );
    });
  });
});
