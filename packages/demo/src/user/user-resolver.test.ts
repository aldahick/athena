import assert from "node:assert";
import { describe, it } from "node:test";
import { UserResolver } from "./user-resolver.js";

describe("user-resolver", () => {
  const userResolver = new UserResolver();
  describe("#users", () => {
    it("should return some users with usernames", async () => {
      const expected = [{ username: "foo" }, { username: "bar" }];
      const actual = await userResolver.users();
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe("#id", () => {
    it("should return md5 hashes of usernames", async () => {
      // md5 of my name. this is a demo
      const expected = ["534b44a19bf18d20b71ecc4eb77c572f"];
      const actual = await userResolver.id([{ username: "alex" }]);
      assert.deepStrictEqual(actual, expected);
    });
  });
});
