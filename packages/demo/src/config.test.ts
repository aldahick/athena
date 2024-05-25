import fs from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { Config } from "./config.js";

describe("Config", () => {
  process.env.HTTP_PORT = "8080";
  const config = new Config();
  describe("graphqlSchemaDirs", () => {
    it("should point to a dir containing graphql files", async () => {
      const files = (
        await Promise.all(
          config.graphqlSchemaDirs.map((dir) =>
            fs.readdir(dir, { recursive: true }),
          ),
        )
      ).flat();
      expect(files.length > 0).toEqual(true);
      expect(files.every((f) => f.endsWith(".gql"))).toEqual(true);
    });
  });
});
