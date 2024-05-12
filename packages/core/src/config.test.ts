import "reflect-metadata";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { BaseConfig } from "./config.js";

describe("config", () => {
  const TEST_KEY = "CONFIG_TEST_VAR";

  describe("#optional", () => {
    beforeEach(() => delete process.env[TEST_KEY]);

    it("should return an environment variable", () => {
      class Config extends BaseConfig {
        optionalValue = this.optional(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      const expected = "test";
      process.env[TEST_KEY] = expected;
      const actual = new Config().optionalValue;
      assert.strictEqual(actual, expected);
    });

    it("should return undefined for a missing environment variable", () => {
      class Config extends BaseConfig {
        optionalValue = this.optional(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      const actual = new Config().optionalValue;
      assert.strictEqual(actual, undefined);
    });
  });

  describe("#required", () => {
    beforeEach(() => delete process.env[TEST_KEY]);

    it("should return an environment variable", () => {
      class Config extends BaseConfig {
        requiredValue = this.required(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      const expected = "test";
      process.env[TEST_KEY] = expected;
      const actual = new Config().requiredValue;
      assert.strictEqual(actual, expected);
    });

    it("should throw for a missing environment variable", () => {
      class Config extends BaseConfig {
        requiredValue = this.required(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      assert.throws(() => new Config());
    });
  });
});
