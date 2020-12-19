import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { Request } from "express";

import { BaseAuthContext } from "./BaseAuthContext";

export interface AuthProvider<TokenPayload, Context extends BaseAuthContext> {
  getContext: (req: Request, tokenPayload: TokenPayload | undefined) => Context;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthProviderClass = AnyParamConstructor<AuthProvider<any, BaseAuthContext>>;
