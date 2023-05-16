import assert from "node:assert";
import { describe, it } from "node:test";

import { chunk, compact, sortBy } from "./array-utils.js";

describe("array-utils", () => {
  describe("#chunk", () => {
    it("should chunk even arrays", () => {
      const input = [1, 2, 3, 4];
      const expected = [
        [1, 2],
        [3, 4],
      ];
      const actual = chunk(input, 2);
      assert.deepStrictEqual(actual, expected);
    });
    it("should chunk odd arrays", () => {
      const input = [1, 2, 3, 4, 5];
      const expected = [
        [1, 2, 3],
        [4, 5],
      ];
      const actual = chunk(input, 3);
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe("#compact", () => {
    it("should remove null and undefined entries", () => {
      const input = [1, null, 3, undefined, void 0, 5];
      const expected = [1, 3, 5];
      const actual = compact(input);
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe("#sortBy", () => {
    const input = [{ x: "b" }, { x: "a" }];
    const expected = [{ x: "a" }, { x: "b" }];
    it("should sort by a key", () => {
      const actual = sortBy(input, "x");
      assert.deepStrictEqual(actual, expected);
    });
    it("should sort by a comparator function", () => {
      const actual = sortBy(input, (a) => a.x);
      assert.deepStrictEqual(actual, expected);
    });
  });
});
