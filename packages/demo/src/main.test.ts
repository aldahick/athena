import { describe, expect, it } from "vitest";
import { withTestApp } from "./test-util.js";

describe("main", () => {
  it("should start a working GraphQL server", async () => {
    await withTestApp(async (sdk) => {
      const { hello } = await sdk.hello();
      expect(hello).toEqual("hello, world!");
    });
  });
});
