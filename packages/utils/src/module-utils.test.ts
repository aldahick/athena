import { describe, it } from "node:test";
import process from "node:process";
import { resolve } from "node:path";
import { getModuleDir } from "./module-utils.js";
import assert from "node:assert";

describe("module-utils", () => {
  describe("getModuleDir", () => {
    it("should return the directory of the caller's file", () => {
      const expected = resolve(process.cwd(), "dist");
      const actual = getModuleDir(import.meta);
      assert.strictEqual(actual, expected);
    });
  });
});
