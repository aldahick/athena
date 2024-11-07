import { container, injectable } from "tsyringe";
import { describe, expect, it, vi } from "vitest";
import { resolveQuery, resolver } from "../graphql/graphql-decorators.js";
import { BaseConfig, config, createApp, injectConfig } from "../index.js";
import { Logger } from "../logger.js";
import {
  createTestConfig,
  fetchTestGraphql,
  getTestBaseUrl,
} from "../test-util.js";

describe("error", () => {
  const testCases = [
    {
      expected: "normal error",
      error: new Error("normal error"),
    },
    {
      expected: "stackless error",
      error: (() => {
        const error = new Error("stackless error");
        error.stack = undefined;
        return error;
      })(),
    },
    {
      expected: "string error",
      error: "string error",
    },
    {
      expected: "unknown error",
      error: 3,
    },
  ];

  for (const testCase of testCases) {
    it(`should catch and log errors like "${testCase.expected}"`, async () => {
      @injectable()
      class TestLogger extends Logger {
        error = vi.fn().mockReturnThis();

        constructor(@injectConfig() config: BaseConfig) {
          super(config);
        }
      }

      @resolver()
      class ErrorResolver {
        @resolveQuery()
        hello() {
          throw testCase.error;
        }
      }

      const config = createTestConfig();
      const logger = container.resolve(TestLogger);
      container.registerInstance(Logger, logger);
      const app = createApp();
      await app.start();

      const baseUrl = getTestBaseUrl(config);
      try {
        const res = await fetchTestGraphql(baseUrl, "query { hello }");
        expect(res.errors?.length).toEqual(1);
        expect(res.errors?.[0]?.message).toEqual(testCase.expected);
        expect(logger.error).toHaveBeenCalledOnce();
      } finally {
        await app.stop();
      }
    });
  }

  it("should throw startup errors unmodified", () => {
    @config()
    class Config extends BaseConfig {
      graphqlSchemaDirs = [];
      http = { port: Number(this.required("MISSING_VAR")) };
    }
    expect(() => createApp()).throws();
  });

  it("should log uncaught errors", () => {
    @injectable()
    class TestLogger extends Logger {
      error = vi.fn();
    }
    @resolver()
    class HelloResolver {
      @resolveQuery()
      hello() {
        return "hello, world!";
      }
    }

    createTestConfig();
    const logger = container.resolve(TestLogger);
    container.registerInstance(Logger, logger);
    const app = createApp();

    app.handleError(new Error());
    expect(logger.error).toHaveBeenCalledOnce();
  });
});
