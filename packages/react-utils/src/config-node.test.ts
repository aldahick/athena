import { promises as fs } from "node:fs";
import path from "node:path";
import { getModuleDir } from "@athenajs/utils";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { addHtmlConfigAttributes } from "./config.js";

describe("config-node", () => {
  describe("addHtmlConfigAttributes()", () => {
    const testDir = path.resolve(getModuleDir(import.meta), "../test/config");
    const inputEnvPath = path.join(testDir, ".env.example");
    const inputHtmlPath = path.join(testDir, "index.html");
    const outputHtmlPath = path.join(testDir, "index-output.html");

    beforeAll(() => {
      process.env.VAR_1 = "test";
    });

    beforeEach(async () => {
      await fs.rm(outputHtmlPath, { force: true });
    });

    const validateAttributesFile = async () => {
      const expected = await fs.readFile(
        path.join(testDir, "index-expected.html"),
        "utf8",
      );
      const actual = await fs.readFile(outputHtmlPath, "utf8");
      expect(actual).toEqual(expected);
    };

    it("should pass command-line arguments if invoked directly", async () => {
      const originalArgs = [...process.argv];
      const scriptPath = path.resolve(
        getModuleDir(import.meta),
        "config-node.js",
      );
      process.argv.splice(1, process.argv.length - 1);
      process.argv.push(
        scriptPath,
        inputHtmlPath,
        inputEnvPath,
        outputHtmlPath,
      );
      try {
        await import("./config-node.js");
        await validateAttributesFile();
      } finally {
        process.argv = originalArgs;
      }
    });

    it("should populate the body tag with env name attributes", async () => {
      await addHtmlConfigAttributes(
        inputHtmlPath,
        inputEnvPath,
        outputHtmlPath,
      );
      await validateAttributesFile();
    });
  });
});
