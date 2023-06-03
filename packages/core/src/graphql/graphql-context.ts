import { IncomingHttpHeaders } from "http";

export interface ContextRequest {
  headers: IncomingHttpHeaders;
}

export type ContextGenerator = <Context extends object>(
  req: ContextRequest
) => Promise<Context | undefined>;

export const ContextGenerator = Symbol("GraphQLContextGenerator");
