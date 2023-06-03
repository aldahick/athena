import assert from "node:assert";
import { describe, it } from "node:test";

import gql, { OperationDefinitionNode } from "graphql";

import {
  extractOperationNames,
  extractSelectedFields,
} from "./graphql-utils.js";

describe("graphql-utils", () => {
  describe("#extractSelectedFields", () => {
    it("should extract all selected fields from field nodes", () => {
      const node = gql.parse("query { users { id, profile { email } } }");
      const expected = ["id", "email", "profile", "users"];
      const actual = extractSelectedFields(node.definitions);
      assert.deepStrictEqual(actual, expected);
    });
  });
  describe("#extractOperationNames", () => {
    it("should extract operation names from a document", () => {
      const node = gql.parse("query user { users(id: 1) { id } }");
      const expected = ["query.users"];
      const actual = extractOperationNames(node);
      assert.deepStrictEqual(actual, expected);
    });
  });
});
