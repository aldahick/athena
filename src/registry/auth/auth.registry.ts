import * as express from "express";
import { container, singleton } from "tsyringe";

import { AuthService } from "../../service/auth";
import { LoggerService } from "../../service/logger";
import { AuthProvider, AuthProviderClass } from "./AuthProvider";
import { BaseAuthContext } from "./BaseAuthContext";

@singleton()
export class AuthRegistry {
  provider?: AuthProvider<unknown, BaseAuthContext>;

  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) { }

  addProvider(provider: AuthProviderClass): void {
    if (this.provider) {
      this.logger.warn({
        oldProvider: this.provider.constructor.name,
        newProvider: provider.name
      }, "multiple AuthProviders registered");
    }
    this.provider = container.resolve(provider);
  }

  createContext(req: express.Request): BaseAuthContext {
    const [bearerPrefix, bearerToken] = (req.headers.authorization ?? "").split(" ");
    const queryToken = req.query.token?.toString();
    const token = bearerPrefix.toLowerCase() === "bearer" && bearerToken ? bearerToken : queryToken;
    return this.createContextFromToken(req, token);
  }

  /** some protocols don't provide a particularly sane way of getting token from request */
  createContextFromToken(req: express.Request, token: string | undefined): BaseAuthContext {
    if (!this.provider) {
      return {
        req,
        isAuthorized: (): Promise<boolean> => Promise.resolve(false)
      };
    }
    let payload: unknown;
    if (token !== undefined) {
      try {
        payload = this.authService.verifyToken(token);
      } catch (err) {
        // we can just ignore verification errors, treat it as no-auth
      }
    }
    return this.provider.getContext(req, payload);
  }
}
