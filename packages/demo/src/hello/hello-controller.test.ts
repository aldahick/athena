import { describe, it } from "node:test";

import assert from "assert";

import { HelloController } from "./hello-controller.js";

describe("hello-controller", () => {
  const helloController = new HelloController();
  describe("#hello", () => {
    it("should return a polite, understated greeting", async () => {
      const expected = "hello, world!";
      const actual = await helloController.hello();
      assert.strictEqual(actual, expected);
    });
  });
});
