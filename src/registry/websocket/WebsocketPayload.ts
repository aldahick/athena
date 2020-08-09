import { BaseAuthContext } from "../auth";
import { WebsocketWithContext } from "./WebsocketWithContext";

export interface WebsocketPayload<Data, AuthContext extends BaseAuthContext = BaseAuthContext> {
  socket: WebsocketWithContext<AuthContext>;
  data: Data;
  context: AuthContext;
}
