import { describe, expect, it } from "vitest";
import { controller, get, post } from "../http/http-decorators.js";
import { withTestApp } from "../test-util.js";

describe("http", () => {
  it("should register http controllers", () => {
    @controller()
    class _HelloController {
      @get("/hello")
      hello(): Promise<{ hello: string }> {
        return Promise.resolve({ hello: "hello, world!" });
      }
      @post("/hello")
      postHello(): Promise<void> {
        return Promise.resolve();
      }
    }

    return withTestApp(async (baseUrl) => {
      const res = await fetch(`${baseUrl}/hello`, {
        method: "GET",
      }).then((r) => r.json());
      expect(res).toEqual({ hello: "hello, world!" });
    });
  });
});
