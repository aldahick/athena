import assert from "node:assert";
import { describe, it } from "node:test";

import { chunk, sortBy } from "./array-utils.js";

describe("array-utils", () => {
  describe("#chunk", () => {
    it("should chunk even arrays", () => {
      const arr = [1, 2, 3, 4];
      const expected = [
        [1, 2],
        [3, 4],
      ];
      const actual = chunk(arr, 2);
      assert.deepStrictEqual(actual, expected);
    });
    it("should chunk odd arrays", () => {
      const arr = [1, 2, 3, 4, 5];
      const expected = [
        [1, 2, 3],
        [4, 5],
      ];
      const actual = chunk(arr, 3);
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe("#sortBy", () => {
    const arr = [{ x: "b" }, { x: "a" }];
    const expected = [{ x: "a" }, { x: "b" }];
    it("should sort by a key", () => {
      const actual = sortBy(arr, "x");
      assert.deepStrictEqual(actual, expected);
    });
    it("should sort by a comparator function", () => {
      const actual = sortBy(arr, (a) => a.x);
      assert.deepStrictEqual(actual, expected);
    });
  });
});
