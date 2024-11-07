import { GraphQLScalarType } from "graphql";
import { describe, expect, it } from "vitest";
import {
  resolveField,
  resolveQuery,
  resolveScalar,
  resolver,
} from "../graphql/graphql-decorators.js";
import { fetchTestGraphql, withTestApp } from "../test-util.js";

describe("resolver", () => {
  it("should register batch resolvers", () => {
    @resolver()
    class PersonResolver {
      @resolveQuery("people")
      people() {
        return [{ id: "first" }, { id: "second" }];
      }

      @resolveField("Person.name", true)
      hello(people: { id: string }[]) {
        expect(people).toEqual([{ id: "first" }, { id: "second" }]);
        return ["first name", "second name"];
      }
    }

    return withTestApp(async (baseUrl) => {
      const res = await fetchTestGraphql(
        baseUrl,
        "query { people { id, name } }",
      );
      expect(res).toEqual({
        data: {
          people: [
            { id: "first", name: "first name" },
            { id: "second", name: "second name" },
          ],
        },
      });
    });
  });

  it("should register scalar resolvers", () => {
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

    return withTestApp(async (baseUrl) => {
      const res = await fetchTestGraphql(baseUrl, "query { today }");
      expect(res).toEqual({ data: { today: today.toISOString() } });
    });
  });

  it("should allow 'this' access in resolvers", () => {
    @resolver()
    class HelloResolver {
      private greeting = "hello, world";
      @resolveQuery()
      hello() {
        return this.greeting;
      }
    }

    return withTestApp(async (baseUrl) => {
      const res = await fetchTestGraphql(baseUrl, "query { hello }");
      expect(res).toEqual({ data: { hello: "hello, world" } });
    });
  });
});
