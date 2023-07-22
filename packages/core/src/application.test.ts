/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";

import { beforeEach, describe, it } from "node:test";

import { getModuleDir } from "@athenajs/utils";
import assert from "assert";
import { FastifyReply, FastifyRequest } from "fastify";
import { GraphQLScalarType } from "graphql";
import path from "path";

import { createApp } from "./application.js";
import { BaseConfig, config } from "./config.js";
import {
  container,
  ContextGenerator,
  contextGenerator,
  ContextRequest,
  controller,
  get,
  HttpRequest,
  HttpResponse,
  Logger,
  post,
  resolveField,
  resolveQuery,
  resolver,
  resolveScalar,
} from "./index.js";

describe("application", () => {
  describe("#createApp", async () => {
    beforeEach(() => container.reset());

    const initConfig = (testName = "base"): new () => BaseConfig => {
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
          assert.deepStrictEqual(context, { test: "context" });
          return { hello: "hello, world!" };
        }
      }
      @resolver()
      class HelloResolver {
        @resolveQuery()
        hello(root: void, args: void, context: object) {
          assert.deepStrictEqual(context, { test: "context" });
          return "hello, world!";
        }
      }
      @contextGenerator()
      class TestContextGenerator implements ContextGenerator {
        async generateContext(
          req: ContextRequest,
        ): Promise<object | undefined> {
          return { test: "context" };
        }
      }
      const Config = initConfig();
      const app = createApp();
      await app.start();
      const config = container.resolve(Config);
      const baseUrl = `http://localhost:${config.http.port}/`;
      try {
        let res = await fetch(`${baseUrl}graphql`, {
          method: "POST",
          body: JSON.stringify({ query: "query { hello }" }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((r) => r.json());
        assert.deepStrictEqual(res, { data: { hello: "hello, world!" } });

        res = await fetch(`${baseUrl}hello`).then((r) => r.json());
        assert.deepStrictEqual(res, { hello: "hello, world!" });
      } finally {
        await app.stop();
      }
    });

    it("should register http controllers", async () => {
      @controller()
      class HelloController {
        @get("/hello")
        async hello(): Promise<{ hello: string }> {
          return { hello: "hello, world!" };
        }
        @post("/hello")
        async postHello(): Promise<void> {
          return;
        }
      }
      const Config = initConfig();
      const app = createApp();
      await app.start();
      const config = container.resolve(Config);
      try {
        const res = await fetch(`http://localhost:${config.http.port}/hello`, {
          method: "GET",
        }).then((r) => r.json());
        assert.deepStrictEqual(res, { hello: "hello, world!" });
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
        async today(): Promise<Date> {
          return today;
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
      const Config = initConfig("scalar");
      const app = createApp();
      await app.start();
      const config = container.resolve(Config);
      const baseUrl = `http://localhost:${config.http.port}/`;
      try {
        const res = await fetch(`${baseUrl}graphql`, {
          method: "POST",
          body: JSON.stringify({ query: "query { today }" }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((r) => r.json());
        assert.deepStrictEqual(res, { data: { today: today.toISOString() } });
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
      assert.throws(() => createApp());
    });

    it("should log uncaught errors", () => {
      class TestLogger extends Logger {
        error = (): Logger => {
          return this;
        };
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
  });
});
