import assert from "node:assert";
import { promises as fs } from "node:fs";
import path from "node:path";
import { before, describe, it } from "node:test";

import { getModuleDir } from "@athenajs/utils";

import { addHtmlConfigAttributes } from "./config.js";

describe("config", () => {
  describe("addHtmlConfigAttributes", () => {
    let testDir: string;
    before(async () => {
      testDir = path.resolve(getModuleDir(import.meta), "../test/config");
    });

    it("should populate the body tag with env name attributes", async () => {
      const outputHtmlPath = path.join(testDir, "index-output.html");
      await addHtmlConfigAttributes(
        path.join(testDir, "index.html"),
        path.join(testDir, ".env.example"),
        outputHtmlPath,
      );
      const expected = await fs.readFile(
        path.join(testDir, "index-expected.html"),
        "utf8",
      );
      const actual = await fs.readFile(outputHtmlPath, "utf8");
      assert.strictEqual(actual, expected);
    });
  });
});
