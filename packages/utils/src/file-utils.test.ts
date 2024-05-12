import assert from "node:assert";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { recursiveReaddir, tempFile } from "./file-utils.js";
import { getModuleDir } from "./module-utils.js";

describe("file-utils", () => {
  describe("#recursiveReaddir", () => {
    const testDir = resolve(
      getModuleDir(import.meta),
      "../test/file-utils/recursiveReaddir",
    );
    it("should return children in a single-level directory", async () => {
      const dir = resolve(testDir, "b");
      const expected = [resolve(dir, "c")];
      const actual = await recursiveReaddir(dir);
      assert.deepEqual(actual, expected);
    });
    it("should return all children in a multi-level directory", async () => {
      const expected = [resolve(testDir, "a"), resolve(testDir, "b/c")];
      const actual = (await recursiveReaddir(testDir)).sort();
      assert.deepEqual(actual, expected);
    });
  });

  describe("#tempFile", () => {
    it("should return an absolute path", () => {
      const actual = tempFile();
      assert.strict(actual.startsWith(tmpdir()));
      assert.strictEqual(actual.length, 21);
    });
    it("should handle non-default nameLength", () => {
      const actual = tempFile(8);
      assert.strict(actual.startsWith(tmpdir()));
      assert.strictEqual(actual.length, 13);
    });
  });
});
