import assert from "node:assert";
import { describe, it } from "node:test";
import { HelloResolver } from "./hello-resolver.js";

describe("hello-resolver", () => {
  const helloResolver = new HelloResolver();
  describe("#hello", () => {
    it("should return a polite, understated greeting", async () => {
      const expected = "hello, world!";
      const actual = await helloResolver.hello();
      assert.strictEqual(actual, expected);
    });
  });
});
