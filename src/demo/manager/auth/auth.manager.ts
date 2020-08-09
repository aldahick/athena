import { Request } from "express";
import { singleton } from "tsyringe";
import { AuthProvider, authProvider, AuthService } from "../../..";
import { User } from "../../model/mongo/User";
import { DemoAuthContext } from "./DemoAuthContext";
import { DemoTokenPayload } from "./DemoTokenPayload";

@authProvider
@singleton()
export class AuthManager implements AuthProvider<DemoTokenPayload, DemoAuthContext> {
  constructor(
    private readonly authService: AuthService
  ) { }

  getContext(req: Request, payload?: DemoTokenPayload): DemoAuthContext {
    return new DemoAuthContext(req, payload);
  }

  createToken(user: User): string {
    const payload: DemoTokenPayload = {
      userId: user._id
    };
    return this.authService.signToken(payload);
  }
}
