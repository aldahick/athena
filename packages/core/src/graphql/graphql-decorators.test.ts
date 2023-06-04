import "reflect-metadata";

import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";

import { container, injectable } from "../container.js";
import {
  getResolverBatch,
  getResolverInfo,
  getResolverTypeName,
  injectResolvers,
  resolveField,
  resolveMutation,
  resolveQuery,
  resolver,
  resolverToken,
} from "./graphql-decorators.js";

describe("graphql-decorators", () => {
  describe("#resolver", () => {
    beforeEach(() => container.reset());

    it("should register a class in the container", () => {
      @resolver()
      class HelloResolver {}
      assert.strictEqual(container.isRegistered(HelloResolver), true);
    });

    it("should register a class as a resolver in the container", () => {
      @resolver()
      class HelloResolver {}

      const expected = [HelloResolver];
      const resolvers = container.resolveAll<object>(resolverToken);
      const actual = resolvers.map((r) => r.constructor);
      assert.deepStrictEqual(actual, expected);
    });
  });

  describe("#resolveField", () => {
    beforeEach(() => container.reset());

    it("should register a field resolver with specified name", () => {
      const expected = "Query.hello";
      @resolver()
      class HelloResolver {
        @resolveField(expected)
        resolve() {
          return;
        }
      }
      const actual = getResolverTypeName(new HelloResolver(), "resolve");
      assert.strictEqual(actual, expected);
    });

    it("should register a field resolver with default name", () => {
      const expected = "Query.hello";
      @resolver()
      class Query {
        @resolveField()
        hello() {
          return;
        }
      }
      const actual = getResolverTypeName(new Query(), "hello");
      assert.strictEqual(actual, expected);
    });

    it("should throw when somehow decorating a non-function", () => {
      @resolver()
      class HelloResolver {
        hello = "hello";
      }
      const helloResolver = new HelloResolver();
      const descriptor = Object.getOwnPropertyDescriptor(
        helloResolver,
        "hello"
      );
      if (!descriptor) {
        throw new Error("somehow missing descriptor");
      }
      assert.throws(() => resolveField()(helloResolver, "hello", descriptor));
    });

    it("should register a field resolver with batch enabled", () => {
      @resolver()
      class UserResolver {
        @resolveField("profile", true)
        async batchProfile() {
          return;
        }
      }
      const actual = getResolverBatch(new UserResolver(), "batchProfile");
      assert.strictEqual(actual, true);
    });
  });

  describe("#resolveQuery", () => {
    beforeEach(() => container.reset());

    it("should register a query resolver with specified name", () => {
      const expected = "Query.hello";
      @resolver()
      class HelloResolver {
        @resolveQuery("hello")
        resolve() {
          return;
        }
      }
      const actual = getResolverTypeName(new HelloResolver(), "resolve");
      assert.strictEqual(actual, expected);
    });

    it("should register a query resolver with default name", () => {
      const expected = "Query.hello";
      @resolver()
      class HelloResolver {
        @resolveQuery()
        hello() {
          return;
        }
      }
      const actual = getResolverTypeName(new HelloResolver(), "hello");
      assert.strictEqual(actual, expected);
    });
  });

  describe("#resolveMutation", () => {
    beforeEach(() => container.reset());

    it("should register a mutation resolver with specified name", () => {
      const expected = "Mutation.hello";
      @resolver()
      class HelloResolver {
        @resolveMutation("hello")
        mutateHello() {
          return;
        }
      }
      const actual = getResolverTypeName(new HelloResolver(), "mutateHello");
      assert.strictEqual(actual, expected);
    });

    it("should register a mutation resolver with default name", () => {
      const expected = "Mutation.hello";
      @resolver()
      class HelloResolver {
        @resolveMutation()
        hello() {
          return;
        }
      }
      const actual = getResolverTypeName(new HelloResolver(), "hello");
      assert.strictEqual(actual, expected);
    });
  });

  describe("#injectResolvers", () => {
    beforeEach(() => container.reset());

    it("should provide all registered resolvers", () => {
      @resolver()
      class HelloResolver {}
      @resolver()
      class GoodbyeResolver {}
      @injectable()
      class ResolverConsumer {
        constructor(@injectResolvers() public resolvers: object[]) {}
      }

      const expected = [HelloResolver, GoodbyeResolver];
      const consumer = container.resolve(ResolverConsumer);
      const actual = consumer.resolvers.map((r) => r.constructor);
      assert.deepStrictEqual(actual, expected);
    });
  });

  describe("#getResolverInfo", () => {
    beforeEach(() => container.reset());

    it("should return info about all defined resolvers on the target class", () => {
      @resolver()
      class UserResolver {
        @resolveQuery("users")
        fetchMany() {
          return;
        }
        @resolveMutation("createUser")
        create() {
          return;
        }
        @resolveField("User.profile", true)
        profile() {
          return;
        }
      }

      const expected = new Map([
        ["Query.users", { key: "fetchMany", batch: false }],
        ["Mutation.createUser", { key: "create", batch: false }],
        ["User.profile", { key: "profile", batch: true }],
      ]);
      const actual = getResolverInfo(new UserResolver());
      assert.deepStrictEqual(actual, expected);
    });

    it("should throw for an unregistered target class", () => {
      class UserResolver {}
      assert.throws(() => getResolverInfo(UserResolver));
    });
  });
});
