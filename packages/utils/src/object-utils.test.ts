import { describe, expect, it } from "vitest";
import { assignDeep } from "./object-utils.js";

describe("object-utils", () => {
  describe("assignDeep()", () => {
    it("should assign top-level keys", () => {
      const obj = { a: 2 };
      const expected = 5;
      assignDeep(obj, "a", expected);
      expect(obj.a).toEqual(expected);
    });

    it("should assign second-level keys", () => {
      const obj = { a: { b: 3 } };
      const expected = 6;
      assignDeep(obj, "a.b", expected);
      expect(obj.a.b).toEqual(expected);
    });

    it("should assign keys whose parents are missing", () => {
      const obj: { [key: string]: { [key: string]: string } } = {};
      const expected = 7;
      assignDeep(obj, "a.b", expected);
      expect(obj.a?.b).toEqual(expected);
    });
  });
});
