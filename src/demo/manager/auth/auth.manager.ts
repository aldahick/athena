import { IncomingMessage } from "http";
import { singleton } from "tsyringe";

import { AuthProvider, AuthService } from "../../..";
import { User } from "../../model/mongo/User";
import { DemoAuthContext } from "./DemoAuthContext";
import { DemoTokenPayload } from "./DemoTokenPayload";

@singleton()
export class AuthManager implements AuthProvider<DemoTokenPayload> {
  constructor(private readonly authService: AuthService) {}

  getContext(req: IncomingMessage, payload?: DemoTokenPayload): DemoAuthContext {
    return new DemoAuthContext(req, payload);
  }

  createToken(user: User): string {
    const payload: DemoTokenPayload = {
      userId: user._id
    };
    return this.authService.signToken(payload);
  }
}
