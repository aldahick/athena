import { describe, expect, it } from "vitest";
import { HelloResolver } from "./hello-resolver.js";

describe("HelloResolver", () => {
  const helloResolver = new HelloResolver();
  describe("hello()", () => {
    it("should return a polite, understated greeting", async () => {
      const expected = "hello, world!";
      const actual = await helloResolver.hello();
      expect(actual).toEqual(expected);
    });
  });
});
