import assert from "node:assert";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { getConfigFromAttributes } from "./config.js";

describe("config", () => {
  describe("getConfigFromAttributes", () => {
    const mockBody = {
      getAttributeNames: mock.fn(),
      getAttribute: mock.fn(),
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
      mock.reset();
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

      mockBody.getAttributeNames.mock.mockImplementation(() =>
        Object.keys(attributes),
      );
      mockBody.getAttribute.mock.mockImplementation(
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
        assert.strictEqual(actual[key], value);
      }
    });
  });
});
