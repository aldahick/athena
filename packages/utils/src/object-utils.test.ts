import assert from "node:assert";
import { describe, it } from "node:test";

import { assign, omit } from "./object-utils.js";

describe("object-utils", () => {
  describe("#assign", () => {
    it("should assign top-level keys", () => {
      const obj = { a: 2 };
      const expected = 5;
      assign(obj, "a", expected);
      assert.strictEqual(obj.a, expected);
    });
    it("should assign second-level keys", () => {
      const obj = { a: { b: 3 } };
      const expected = 6;
      assign(obj, "a.b", expected);
      assert.strictEqual(obj.a.b, expected);
    });
    it("should assign keys whose parents are missing", () => {
      const obj: { [key: string]: { [key: string]: string } } = {};
      const expected = 7;
      assign(obj, "a.b", expected);
      assert.strictEqual(obj.a.b, expected);
    });
  });

  describe("#omit", () => {
    it("should omit all keys provided", () => {
      const obj = { x: 2, y: 3 };
      const expected = { x: 2 };
      const actual = omit(obj, "y");
      assert.deepStrictEqual(actual, expected);
    });
  });
});
