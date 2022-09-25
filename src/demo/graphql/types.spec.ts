import "reflect-metadata";

import { ResolverRegistry } from "../../registry/resolver";

const resolverRegistry = ResolverRegistry;

describe("demo graphql schema", () => {
  it("should validate successfully", async () => {
    await expect(resolverRegistry.validate(`${__dirname}/../../../src/demo/graphql`)).resolves.toEqual(undefined);
  });
});
