import { IncomingHttpHeaders } from "node:http";
import { Context, SubscribePayload } from "graphql-ws";
import { container, makeRegistryDecorator } from "../container.js";

export interface ContextRequest {
  headers: IncomingHttpHeaders;
  query: Record<string, string>;
}

export interface ContextGenerator {
  httpContext(req: ContextRequest): Promise<unknown | undefined>;
  websocketContext?(
    context: Context,
    payload: SubscribePayload,
  ): Promise<unknown | undefined>;
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
