import "reflect-metadata";
import path from "node:path";
import { getModuleDir } from "@athenajs/utils";
import { GraphQLScalarType } from "graphql";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./application.js";
import { BaseConfig, config } from "./config.js";
import { resolveConfig } from "./config.js";
import {
  ContextGenerator,
  ContextRequest,
  HttpRequest,
  HttpResponse,
  Logger,
  container,
  contextGenerator,
  controller,
  get,
  post,
  resolveField,
  resolveQuery,
  resolveScalar,
  resolver,
} from "./index.js";
import { fetchTestGraphql } from "./test-util.js";

describe("application", () => {
  describe("#createApp", async () => {
    beforeEach(() => container.reset());

    const initConfig = (testName = "base"): (new () => BaseConfig) => {
      @config()
      class Config extends BaseConfig {
        graphqlSchemaDirs = [
          path.join(
            getModuleDir(import.meta),
            "../test/application/schema",
            testName,
          ),
        ];
        http = { port: 8080 };
      }
      return Config;
    };

    it("should start and stop", async () => {
      @resolver()
      class HelloResolver {
        @resolveQuery()
        hello() {
          return "hello, world!";
        }
      }
      initConfig();
      const app = createApp();
      try {
        await app.start();
      } finally {
        await app.stop();
      }
    });

    it("should start and stop multiple times", async () => {
      @resolver()
      class HelloResolver {
        @resolveQuery()
        hello() {
          return "hello, world!";
        }
      }
      initConfig();
      const app = createApp();
      for (let i = 0; i < 5; i++) {
        try {
          await app.start();
        } finally {
          await app.stop();
        }
      }
    });

    it("should register batch resolvers", async () => {
      @resolver()
      class HelloResolver {
        @resolveField("Query.hello", true)
        hello() {
          return "hello, world!";
        }
      }
      initConfig();
      const app = createApp();
      try {
        await app.start();
      } finally {
        await app.stop();
      }
    });

    it("should register context generator for http and graphql", async () => {
      // TODO split into several tests
      @controller()
      class HelloController {
        @get("/hello")
        hello(req: HttpRequest, res: HttpResponse, context: object): object {
          expect(context).toEqual({ test: "context" });
          return { hello: "hello, world!" };
        }
      }
      @resolver()
      class HelloResolver {
        @resolveQuery()
        hello(root: never, args: never, context: object) {
          expect(context).toEqual({ test: "context" });
          return "hello, world!";
        }
      }
      @contextGenerator()
      class TestContextGenerator implements ContextGenerator {
        generateContext(req: ContextRequest): Promise<object> {
          return Promise.resolve({ test: "context" });
        }
      }
      initConfig();
      const app = createApp();
      await app.start();
      try {
        const [res, baseUrl] = await fetchTestGraphql("query { hello }");
        expect(res).toEqual({ data: { hello: "hello, world!" } });

        const restRes = await fetch(`${baseUrl}hello`).then((r) => r.json());
        expect(restRes).toEqual({ hello: "hello, world!" });
      } finally {
        await app.stop();
      }
    });

    it("should register http controllers", async () => {
      @controller()
      class HelloController {
        @get("/hello")
        hello(): Promise<{ hello: string }> {
          return Promise.resolve({ hello: "hello, world!" });
        }
        @post("/hello")
        postHello(): Promise<void> {
          return Promise.resolve();
        }
      }
      initConfig();
      const app = createApp();
      await app.start();
      const config = resolveConfig();
      try {
        const res = await fetch(`http://localhost:${config.http.port}/hello`, {
          method: "GET",
        }).then((r) => r.json());
        expect(res).toEqual({ hello: "hello, world!" });
      } finally {
        await app.stop();
      }
    });

    it("should register scalar resolvers", async () => {
      // for simplicity's sake, we assume tests will only be run within a calendar day. :)
      const today = new Date();
      @resolver()
      class DateResolver {
        @resolveQuery()
        today(): Promise<Date> {
          return Promise.resolve(today);
        }

        @resolveScalar("Date")
        dateScalar = new GraphQLScalarType({
          name: "Date",
          serialize: (value: unknown): string => {
            if (value instanceof Date) {
              return value.toISOString();
            }
            throw new Error(`Cannot serialize unknown value ${value} as date`);
          },
        });
      }
      initConfig("scalar");
      const app = createApp();
      await app.start();
      try {
        const [res] = await fetchTestGraphql("query { today }");
        expect(res).toEqual({ data: { today: today.toISOString() } });
      } finally {
        await app.stop();
      }
    });

    it("should throw most errors unmodified", () => {
      @config()
      class Config extends BaseConfig {
        graphqlSchemaDirs = [];
        http = { port: Number(this.required("MISSING_VAR")) };
      }
      expect(() => createApp()).throws();
    });

    it("should log uncaught errors", () => {
      class TestLogger extends Logger {
        error = () => this;
      }
      @resolver()
      class HelloResolver {
        @resolveQuery()
        hello() {
          return "hello, world!";
        }
      }
      const Config = initConfig();
      const config = container.resolve(Config);
      container.registerInstance(Logger, new TestLogger(config));
      const app = createApp();
      app.handleError(new Error());
    });

    it("should catch and log resolver errors", async () => {
      class TestLogger extends Logger {
        calls = 0;
        error = () => {
          this.calls++;
          return this;
        };
      }
      @resolver()
      class ErrorResolver {
        @resolveQuery()
        error() {
          throw new Error("normal error");
        }
        @resolveQuery()
        errorStackless() {
          const err = new Error("stackless error");
          err.stack = undefined;
          throw err;
        }
        @resolveQuery()
        errorString() {
          throw "string error";
        }
        @resolveQuery()
        errorNumber() {
          throw -1;
        }
      }
      const Config = initConfig("error");
      const config = container.resolve(Config);
      const logger = new TestLogger(config);
      container.registerInstance(Logger, logger);
      const app = createApp();
      await app.start();
      const cases = [
        ["error", "normal error"],
        ["errorStackless", "stackless error"],
        ["errorString", "string error"],
        ["errorNumber", "unknown error"],
      ];
      try {
        for (const [query, expected] of cases) {
          const [res] = await fetchTestGraphql(`query { ${query} }`);
          expect(res.errors?.length).toEqual(1);
          expect(res.errors?.[0]?.message).toEqual(expected);
        }
        expect(logger.calls).toEqual(cases.length);
      } finally {
        await app.stop();
      }
    });

    it("should allow 'this' access in resolvers", async () => {
      @resolver()
      class HelloResolver {
        private greeting = "hello, world";
        @resolveQuery()
        hello() {
          return this.greeting;
        }
      }
      initConfig();
      const app = createApp();
      await app.start();
      try {
        const [res] = await fetchTestGraphql("query { hello }");
        expect(res.data?.hello).toEqual("hello, world");
      } finally {
        await app.stop();
      }
    });
  });
});
