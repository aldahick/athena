import { singleton } from "tsyringe";
import { AuthRegistry,BaseAuthContext } from "../auth";
import { websocketEvent } from "./websocket.decorators";
import { WebsocketPayload } from "./WebsocketPayload";

@singleton()
export class AuthWebsocketHandler {
  constructor(
    private authRegistry: AuthRegistry
  ) { }

  @websocketEvent("athena.auth")
  async auth({ data, socket }: WebsocketPayload<string, BaseAuthContext>) {
    (socket as any).context = this.authRegistry.createContextFromToken(socket.request, data.toString());
    return true;
  }
}
