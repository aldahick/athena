import assert from "node:assert";
import { describe, it } from "node:test";

import { assign, groupBy, omit } from "./object-utils.js";

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

  describe("#groupBy", () => {
    const items = [
      { a: 1, b: 10 },
      { a: 2, b: 12 },
      { a: 2, b: 15 },
    ];
    it("should return items grouped by key", () => {
      const actual = groupBy(items, (i) => i.a);
      const expected = new Map([
        [1, [items[0]]],
        [2, [items[1], items[2]]],
      ]);
      assert.deepStrictEqual(actual, expected);
    });
    it("should map values grouped by key when toValue is provided", () => {
      const actual = groupBy(
        items,
        (i) => i.a,
        (i) => i.b
      );
      const expected = new Map([
        [1, [10]],
        [2, [12, 15]],
      ]);
      assert.deepStrictEqual(actual, expected);
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
