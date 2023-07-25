import { describe, it } from "node:test";

import assert from "assert";

import { withTestApp } from "../main.test.js";
import { HelloController } from "./hello-controller.js";

describe("hello-controller", () => {
  const helloController = new HelloController();
  describe("#hello", () => {
    it("should return a polite, understated greeting", async () => {
      const expected = { hello: "Hello, world!" };
      const actual = await helloController.hello();
      assert.deepStrictEqual(actual, expected);
    });
  });

  describe("#helloFile", () => {
    it("should take a file and respond briskly", async () => {
      const body = new FormData();
      body.set("file", new Blob(["Hello, world!"]));
      await withTestApp(async (url) => {
        const res = await fetch(`${url}/hello`, {
          method: "POST",
          body,
        });
        assert.strictEqual(res.status, 200);
      });
    });
  });
});
