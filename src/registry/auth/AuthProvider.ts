import { Request } from "express";
import { BaseAuthContext } from "./BaseAuthContext";

export interface AuthProvider<TokenPayload, Context extends BaseAuthContext> {
  getContext(req: Request, tokenPayload: TokenPayload | undefined): Context;
}

export type AuthProviderClass = new(...args: any[]) => AuthProvider<any, any>;
