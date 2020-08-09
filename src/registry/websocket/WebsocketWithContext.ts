import { BaseAuthContext } from "../auth";

export type WebsocketWithContext<AuthContext = BaseAuthContext> = SocketIO.Socket & {
  context: AuthContext;
};
