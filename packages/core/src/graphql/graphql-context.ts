import { IncomingHttpHeaders } from "http";

import { container, injectable, registry } from "../container.js";

export interface ContextRequest {
  headers: IncomingHttpHeaders;
}

export interface ContextGenerator {
  generateContext(req: ContextRequest): Promise<unknown | undefined>;
}

export const contextGeneratorToken = Symbol("GraphQLContextGenerator");

export const contextGenerator = (): ClassDecorator => (target) => {
  const constructor = target as unknown as new () => unknown;
  injectable()(constructor);
  registry([{ token: contextGeneratorToken, useClass: constructor }])(target);
};

export const resolveContextGenerator = (): ContextGenerator | undefined =>
  container.isRegistered(contextGeneratorToken)
    ? container.resolve(contextGeneratorToken)
    : undefined;
