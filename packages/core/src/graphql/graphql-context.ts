import { IncomingHttpHeaders } from "http";

import { container, makeRegistryDecorator } from "../container.js";

export interface ContextRequest {
  headers: IncomingHttpHeaders;
}

export interface ContextGenerator {
  generateContext(req: ContextRequest): Promise<unknown | undefined>;
}

export const contextGeneratorToken = Symbol("GraphQLContextGenerator");

/**
 * Registers a class to provide a GraphQL context. Make sure it implements {@link ContextGenerator}
 */
export const contextGenerator = makeRegistryDecorator(contextGeneratorToken);

export const resolveContextGenerator = (): ContextGenerator | undefined =>
  container.isRegistered(contextGeneratorToken)
    ? container.resolve(contextGeneratorToken)
    : undefined;
