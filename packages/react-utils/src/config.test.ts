import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getConfigFromAttributes } from "./index.js";

describe("config", () => {
  describe("getConfigFromAttributes()", () => {
    const mockBody = {
      getAttributeNames: vi.fn(),
      getAttribute: vi.fn(),
    };
    let originalDocument: Document;

    beforeEach(() => {
      originalDocument = global.document;
      global.document = {
        body: mockBody,
      } as unknown as Document;
    });

    afterEach(() => {
      global.document = originalDocument;
      vi.resetAllMocks();
    });

    it("should parse config from body attributes and environment variables", async () => {
      const attributes = {
        CONFIG_var1: "value1",
        // this should be present as an empty string
        CONFIG_var2: undefined,
        // this should be skipped
        var3: "value3",
      };
      process.env.VITE_var4 = "value4";
      process.env.var5 = "value5";

      mockBody.getAttributeNames.mockReturnValue(Object.keys(attributes));
      mockBody.getAttribute.mockImplementation(
        (key: keyof typeof attributes) => attributes[key],
      );

      const expected = {
        VAR1: "value1",
        VAR2: "",
        VAR3: undefined,
        VITE_VAR4: "value4",
        VAR4: "value4",
        VAR5: "value5",
      };
      const actual = getConfigFromAttributes(process.env);
      for (const [key, value] of Object.entries(expected)) {
        expect(actual[key]).toEqual(value);
      }
    });
  });
});
