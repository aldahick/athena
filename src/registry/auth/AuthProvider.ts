import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { IncomingMessage } from "http";

import { BaseAuthContext } from "./BaseAuthContext";

export interface AuthProvider<TokenPayload, Context extends BaseAuthContext> {
  getContext: (req: IncomingMessage, tokenPayload: TokenPayload | undefined) => Context;
}

export type AuthProviderClass<T> = AnyParamConstructor<AuthProvider<T, BaseAuthContext>>;
