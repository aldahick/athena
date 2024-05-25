import "reflect-metadata";
import { GraphQLScalarType } from "graphql";
import { beforeEach, describe, expect, it } from "vitest";
import { container } from "../container.js";
import {
  ResolverInfo,
  getResolverInfos,
  getResolverInstances,
  resolveField,
  resolveMutation,
  resolveQuery,
  resolveScalar,
  resolver,
  resolverToken,
} from "./graphql-decorators.js";

describe("graphql-decorators", () => {
  describe("#resolver", () => {
    beforeEach(() => container.reset());

    it("should register a class in the container", () => {
      @resolver()
      class HelloResolver {}
      expect(container.isRegistered(HelloResolver)).toEqual(true);
    });

    it("should register a class as a resolver in the container", () => {
      @resolver()
      class HelloResolver {}

      const expected = [HelloResolver];
      const resolvers = container.resolveAll<object>(resolverToken);
      const actual = resolvers.map((r) => r.constructor);
      expect(actual).toEqual(expected);
    });
  });

  describe("#resolveField", () => {
    beforeEach(() => container.reset());

    it("should register a field resolver with specified name", () => {
      const expected = [
        { typeName: "Query.hello", propertyKey: "resolve", batch: false },
      ] satisfies ResolverInfo[];
      @resolver()
      class HelloResolver {
        @resolveField("Query.hello")
        resolve() {
          return;
        }
      }
      const actual = getResolverInfos(new HelloResolver());
      expect(actual).toEqual(expected);
    });

    it("should register a field resolver with default name", () => {
      const expected = [
        { typeName: "Query.hello", propertyKey: "hello", batch: false },
      ] satisfies ResolverInfo[];
      @resolver()
      class Query {
        @resolveField()
        hello() {
          return;
        }
      }
      const actual = getResolverInfos(new Query());
      expect(actual).toEqual(expected);
    });

    it("should throw when somehow decorating a non-function", () => {
      @resolver()
      class HelloResolver {
        hello = "hello";
      }
      const helloResolver = new HelloResolver();
      const descriptor = Object.getOwnPropertyDescriptor(
        helloResolver,
        "hello",
      );
      if (!descriptor) {
        throw new Error("somehow missing descriptor");
      }
      expect(() => resolveField()(helloResolver, "hello", descriptor)).throws();
    });

    it("should register a field resolver with batch enabled", () => {
      const expected = [
        {
          typeName: "User.profile",
          propertyKey: "batchProfile",
          batch: true,
        },
      ] satisfies ResolverInfo[];
      @resolver()
      class UserResolver {
        @resolveField("User.profile", true)
        batchProfile(): Promise<void> {
          return Promise.resolve();
        }
      }
      const actual = getResolverInfos(new UserResolver());
      expect(actual).toEqual(expected);
    });
  });

  describe("#resolveQuery", () => {
    beforeEach(() => container.reset());

    it("should register a query resolver with specified name", () => {
      const expected = [
        { typeName: "Query.hello", propertyKey: "resolve", batch: false },
      ] satisfies ResolverInfo[];
      @resolver()
      class HelloResolver {
        @resolveQuery("hello")
        resolve() {
          return;
        }
      }
      const actual = getResolverInfos(new HelloResolver());
      expect(actual).toEqual(expected);
    });

    it("should register a query resolver with default name", () => {
      const expected = [
        { typeName: "Query.hello", propertyKey: "hello", batch: false },
      ] satisfies ResolverInfo[];
      @resolver()
      class HelloResolver {
        @resolveQuery()
        hello() {
          return;
        }
      }
      const actual = getResolverInfos(new HelloResolver());
      expect(actual).toEqual(expected);
    });
  });

  describe("#resolveMutation", () => {
    beforeEach(() => container.reset());

    it("should register a mutation resolver with specified name", () => {
      const expected = [
        {
          typeName: "Mutation.hello",
          propertyKey: "mutateHello",
          batch: false,
        },
      ] satisfies ResolverInfo[];
      @resolver()
      class HelloResolver {
        @resolveMutation("hello")
        mutateHello() {
          return;
        }
      }
      const actual = getResolverInfos(new HelloResolver());
      expect(actual).toEqual(expected);
    });

    it("should register a mutation resolver with default name", () => {
      const expected = [
        { typeName: "Mutation.hello", propertyKey: "hello", batch: false },
      ] satisfies ResolverInfo[];
      @resolver()
      class HelloResolver {
        @resolveMutation()
        hello() {
          return;
        }
      }
      const actual = getResolverInfos(new HelloResolver());
      expect(actual).toEqual(expected);
    });
  });

  describe("#resolveScalar", () => {
    beforeEach(() => container.reset());

    it("should register a scalar resolver", () => {
      const expected = [
        { typeName: "Date", propertyKey: "date", batch: false },
      ] satisfies ResolverInfo[];
      @resolver()
      class DateResolver {
        @resolveScalar("Date")
        date = new GraphQLScalarType({
          name: "Date",
        });
      }
      const actual = getResolverInfos(new DateResolver());
      expect(actual).toEqual(expected);
    });
  });

  describe("#getResolverInstances", () => {
    beforeEach(() => container.reset());

    it("should provide all registered resolvers", () => {
      @resolver()
      class HelloResolver {}
      @resolver()
      class GoodbyeResolver {}

      const expected = [HelloResolver, GoodbyeResolver];
      const actual = getResolverInstances().map((r) => r.constructor);
      expect(actual).toEqual(expected);
    });
  });

  describe("#getResolverInfos", () => {
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

      const expected = [
        {
          typeName: "Query.users",
          propertyKey: "fetchMany",
          batch: false,
        },
        {
          typeName: "Mutation.createUser",
          propertyKey: "create",
          batch: false,
        },
        {
          typeName: "User.profile",
          propertyKey: "profile",
          batch: true,
        },
      ] satisfies ResolverInfo[];
      const actual = getResolverInfos(new UserResolver());
      expect(actual).toEqual(expected);
    });
  });
});
