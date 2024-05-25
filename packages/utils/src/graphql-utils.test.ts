import { FieldNode, GraphQLResolveInfo, parse } from "graphql";
import { describe, expect, it } from "vitest";
import { extractOperationNames, extractSelectedFields } from "./index.js";

describe("graphql-utils", () => {
  describe("#extractSelectedFields", () => {
    it("should extract all selected fields from resolve info", () => {
      const node = parse("query { users { id, profile { email } } }");
      const expected = ["id", "email", "profile", "users"];
      const actual = extractSelectedFields({
        fieldNodes: node.definitions as unknown as FieldNode[],
      } as unknown as GraphQLResolveInfo);
      expect(actual).toEqual(expected);
    });

    it("should extract all selected fields from field nodes", () => {
      const node = parse("query { users { id, profile { email } } }");
      const expected = ["id", "email", "profile", "users"];
      const actual = extractSelectedFields(node.definitions);
      expect(actual).toEqual(expected);
    });
  });

  describe("#extractOperationNames", () => {
    it("should extract operation names from a document", () => {
      const node = parse("query user { users(id: 1) { id } }");
      const expected = ["query.users"];
      const actual = extractOperationNames(node);
      expect(actual).toEqual(expected);
    });
  });
});
