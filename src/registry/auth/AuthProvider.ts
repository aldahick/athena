import { IncomingMessage } from "http";

import { BaseAuthContext } from "./BaseAuthContext";

export interface AuthProvider<Payload> {
  getContext: (req: IncomingMessage, tokenPayload?: Payload) => BaseAuthContext;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthProviderClass<Payload> = new (...args: any[]) => AuthProvider<Payload>;
