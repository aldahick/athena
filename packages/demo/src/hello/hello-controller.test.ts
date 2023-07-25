import { describe, it } from "node:test";

import assert from "assert";

import { Config } from "../config.js";
import { main } from "../main.js";
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
      const config = new Config();
      const app = await main();
      try {
        const body = new FormData();
        body.set("file", new Blob(["Hello, world!"]));
        const res = await fetch(`http://localhost:${config.http.port}/hello`, {
          method: "POST",
          body,
        });
        assert.strictEqual(res.status, 200);
      } finally {
        await app.stop();
      }
    });
  });
});
