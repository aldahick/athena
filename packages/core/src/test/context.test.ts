import { describe, expect, it } from "vitest";
import { controller, get } from "../http/http-decorators.js";
import {
  ContextGenerator,
  ContextRequest,
  HttpRequest,
  HttpResponse,
  contextGenerator,
  resolveQuery,
  resolver,
} from "../index.js";
import { fetchTestGraphql, withTestApp } from "../test-util.js";

describe("context", () => {
  it("should register context generator for http", () => {
    @controller()
    class HelloController {
      @get("/hello")
      hello(req: HttpRequest, res: HttpResponse, context: object): object {
        expect(context).toEqual({ test: "context" });
        return { hello: "hello, world!" };
      }
    }

    @contextGenerator()
    class TestContextGenerator implements ContextGenerator {
      httpContext(req: ContextRequest): Promise<object> {
        return Promise.resolve({ test: "context" });
      }
    }

    return withTestApp(async (baseUrl) => {
      const res = await fetch(`${baseUrl}/hello`).then((r) => r.json());
      expect(res).toEqual({ hello: "hello, world!" });
    });
  });

  it("should register context generator for graphql", () => {
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
      httpContext(req: ContextRequest): Promise<object> {
        return Promise.resolve({ test: "context" });
      }
    }

    return withTestApp(async (baseUrl) => {
      const res = await fetchTestGraphql(baseUrl, "query { hello }");
      expect(res).toEqual({ data: { hello: "hello, world!" } });
    });
  });
});
