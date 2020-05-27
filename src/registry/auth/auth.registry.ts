import * as express from "express";
import { container,singleton } from "tsyringe";
import { AuthService } from "../../service/auth";
import { LoggerService } from "../../service/logger";
import { AuthProvider, AuthProviderClass } from "./AuthProvider";
import { BaseAuthContext } from "./BaseAuthContext";

@singleton()
export class AuthRegistry {
  provider?: AuthProvider<any, any>;

  constructor(
    private authService: AuthService,
    private logger: LoggerService
  ) { }

  addProvider(provider: AuthProviderClass) {
    if (this.provider) {
      this.logger.warn({
        oldProvider: this.provider.constructor.name,
        newProvider: provider.name
      }, "multiple AuthProviders registered");
    }
    this.provider = container.resolve(provider);
  }

  createContext(req: express.Request): BaseAuthContext {
    if (!this.provider) {
      return {
        req,
        isAuthorized: () => Promise.resolve(false)
      };
    }
    const [bearerPrefix, bearerToken] = (req.headers.authorization || "").split(" ");
    const queryToken = (req.query || (req as any)._query).token?.toString();
    const token = bearerPrefix.toLowerCase() === "bearer" && bearerToken ? bearerToken : queryToken;
    let payload: any;
    if (token) {
      try {
        payload = this.authService.verifyToken(token);
      } catch (err) {
        // we can just ignore verification errors, treat it as no-auth
      }
    }
    return this.provider.getContext(req, payload);
  }
}
