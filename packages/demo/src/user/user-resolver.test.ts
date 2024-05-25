import { createHash } from "node:crypto";
import { container } from "@athenajs/core";
import { describe, expect, it } from "vitest";
import { withTestApp } from "../test-util.js";
import { UserResolver } from "./user-resolver.js";
import { UserService } from "./user-service.js";

const ids = {
  foo: createHash("md5").update("foo").digest("hex"),
  bar: createHash("md5").update("bar").digest("hex"),
};

describe("UserResolver", () => {
  describe("users()", () => {
    it("should resolve IDs", async () => {
      await withTestApp(async (sdk) => {
        const { users } = await sdk.getUsers();
        expect(users).toEqual([
          {
            id: ids.foo,
            username: "foo",
          },
          {
            id: ids.bar,
            username: "bar",
          },
        ]);
      });
    });

    it("should return mocked data", async () => {
      container.register(UserService, {
        useValue: {
          getMany: () => Promise.resolve([{ username: "mocked" }]),
        },
      });
      const resolver = container.resolve(UserResolver);
      const users = await resolver.users();
      expect(users).toEqual([{ username: "mocked" }]);
    });
  });
});
