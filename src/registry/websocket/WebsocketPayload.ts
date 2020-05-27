import { BaseAuthContext } from "../auth";

export interface WebsocketPayload<Data, AuthContext extends BaseAuthContext> {
  socket: SocketIO.Socket;
  data: Data;
  context: AuthContext;
}
