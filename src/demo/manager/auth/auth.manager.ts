import { singleton } from "tsyringe";
import { Request } from "express";
import { authProvider, AuthProvider } from "../../..";
import { User } from "../../model/mongo/User";
import { AuthService } from "../../../service/auth";
import { DemoAuthContext } from "./DemoAuthContext";
import { DemoTokenPayload } from "./DemoTokenPayload";

@authProvider
@singleton()
export class AuthManager implements AuthProvider<DemoTokenPayload, DemoAuthContext> {
  constructor(
    private authService: AuthService
  ) { }

  getContext(req: Request, payload?: DemoTokenPayload) {
    return new DemoAuthContext(req, payload);
  }

  createToken(user: User): string {
    const payload: DemoTokenPayload = {
      userId: user._id
    };
    return this.authService.signToken(payload);
  }
}
