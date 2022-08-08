import { Socket } from "socket.io";

import { BaseAuthContext } from "../auth";

export type WebsocketWithContext<AuthContext = BaseAuthContext> = Socket & {
  context: AuthContext;
};
