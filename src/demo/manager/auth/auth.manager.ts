import { Request } from "express";
import { singleton } from "tsyringe";
import { AuthProvider,authProvider } from "../../..";
import { AuthService } from "../../../service/auth";
import { User } from "../../model/mongo/User";
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
