import assert from "node:assert";
import { resolve } from "node:path";
import process from "node:process";
import { describe, it } from "node:test";

import { getModuleDir } from "./module-utils.js";

describe("module-utils", () => {
  describe("#getModuleDir", () => {
    it("should return the directory of the caller's file", () => {
      const expected = resolve(process.cwd(), "dist");
      const actual = getModuleDir(import.meta);
      assert.strictEqual(actual, expected);
    });
  });
});
