import "reflect-metadata";

import { container } from "tsyringe";

import { ResolverRegistry } from "../../registry/resolver";

let resolverRegistry: ResolverRegistry;

describe("demo graphql schema", () => {
  beforeEach(() => {
    resolverRegistry = container.resolve(ResolverRegistry);
  });
  it("should validate successfully", async () => {
    await expect(resolverRegistry.validate(`${__dirname}/../../../src/demo/graphql`)).resolves.toEqual(undefined);
  });
});
