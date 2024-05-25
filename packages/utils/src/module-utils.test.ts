import { resolve } from "node:path";
import process from "node:process";
import { describe, expect, it } from "vitest";
import { getModuleDir, isModuleMain } from "./module-utils.js";

describe("module-utils", () => {
  describe("getModuleDir()", () => {
    it("should return the directory of the caller's file", () => {
      const expected = resolve(process.cwd(), "src");
      const actual = getModuleDir(import.meta);
      expect(actual).toEqual(expected);
    });
  });

  describe("isModuleMain()", () => {
    it("should return true for this test file", () => {
      const args = [...process.argv];
      process.argv[1] = import.meta.filename;
      try {
        expect(isModuleMain(import.meta)).toEqual(true);
      } finally {
        process.argv = args;
      }
    });

    it("should return false when no file was run", () => {
      const args = [...process.argv];
      process.argv = args.slice(0, 1);
      try {
        expect(isModuleMain(import.meta)).toEqual(false);
      } finally {
        process.argv = args;
      }
    });
  });
});
