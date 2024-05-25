import { container } from "@athenajs/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { UserService } from "./user-service.js";

describe("UserService", () => {
  let service: UserService;
  beforeEach(() => {
    service = container.resolve(UserService);
  });
  afterEach(() => {
    container.clearInstances();
  });

  describe("getMany()", () => {
    it("should return users", async () => {
      const users = await service.getMany();
      expect(users).toEqual([{ username: "foo" }, { username: "bar" }]);
    });
  });
});
