import assert from "node:assert";
import { resolve } from "node:path";
import process from "node:process";
import { describe, it } from "node:test";

import { getModuleDir, isModuleMain } from "./module-utils.js";

describe("module-utils", () => {
  describe("#getModuleDir", () => {
    it("should return the directory of the caller's file", () => {
      const expected = resolve(process.cwd(), "dist");
      const actual = getModuleDir(import.meta);
      assert.strictEqual(actual, expected);
    });
  });

  describe("#isModuleMain", () => {
    it("should return true for this test file", () => {
      assert.strictEqual(isModuleMain(import.meta), true);
    });
    it("should return false when no file was run", () => {
      const args = [...process.argv];
      process.argv = args.slice(0, 1);
      try {
        assert.strictEqual(isModuleMain(import.meta), false);
      } finally {
        process.argv = args;
      }
    });
  });
});
