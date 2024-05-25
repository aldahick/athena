import "reflect-metadata";
import { beforeEach, describe, expect, it } from "vitest";
import { BaseConfig } from "./config.js";

describe("config", () => {
  const TEST_KEY = "CONFIG_TEST_VAR";

  describe("#optional", () => {
    beforeEach(() => {
      delete process.env[TEST_KEY];
    });

    it("should return an environment variable", () => {
      class Config extends BaseConfig {
        optionalValue = this.optional(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      const expected = "test";
      process.env[TEST_KEY] = expected;
      const actual = new Config().optionalValue;
      expect(actual).toEqual(expected);
    });

    it("should return undefined for a missing environment variable", () => {
      class Config extends BaseConfig {
        optionalValue = this.optional(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      const actual = new Config().optionalValue;
      expect(actual).toEqual(undefined);
    });
  });

  describe("#required", () => {
    beforeEach(() => {
      delete process.env[TEST_KEY];
    });

    it("should return an environment variable", () => {
      class Config extends BaseConfig {
        requiredValue = this.required(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      const expected = "test";
      process.env[TEST_KEY] = expected;
      const actual = new Config().requiredValue;
      expect(actual).toEqual(expected);
    });

    it("should throw for a missing environment variable", () => {
      class Config extends BaseConfig {
        requiredValue = this.required(TEST_KEY);
        graphqlSchemaDirs = [];
        http = { port: 0 };
      }
      expect(() => new Config()).throws();
    });
  });
});
