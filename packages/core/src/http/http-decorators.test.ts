import "reflect-metadata";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { container } from "../container.js";
import { HttpMethod, controller, httpRoute } from "./http-decorators.js";

describe("http-decorators", () => {
  describe("#httpRoute", () => {
    beforeEach(() => container.reset());

    it("should throw when somehow decorating a non-function", () => {
      @controller()
      class HelloController {
        hello = "hello";
      }
      const helloController = new HelloController();
      const descriptor = Object.getOwnPropertyDescriptor(
        helloController,
        "hello",
      );
      if (!descriptor) {
        throw new Error("somehow missing descriptor");
      }
      assert.throws(() =>
        httpRoute(HttpMethod.GET, "/hello")(
          helloController,
          "hello",
          descriptor,
        ),
      );
    });
  });
});
