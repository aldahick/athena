import { describe, expect, it } from "vitest";
import { withTestApp } from "../test-util.js";

describe("HelloController", () => {
  describe("hello()", () => {
    it("should return a polite, understated greeting", async () => {
      const expected = { hello: "Hello, world!" };
      await withTestApp(async (sdk, url) => {
        const res = await fetch(`${url}/hello`);
        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual(expected);
      });
    });
  });

  describe("helloFile()", () => {
    it("should take a file and respond briskly", async () => {
      const body = new FormData();
      body.set("file", new Blob(["Hello, world!"]));
      await withTestApp(async (sdk, url) => {
        const res = await fetch(`${url}/hello`, {
          method: "POST",
          body,
        });
        expect(res.status).toEqual(200);
      });
    });
  });
});
