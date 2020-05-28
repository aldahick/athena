import * as joi from "@hapi/joi";
import { singleton } from "tsyringe";
import { AuthRegistry,BaseAuthContext } from "../auth";
import { websocketEvent } from "./websocket.decorators";
import { WebsocketPayload } from "./WebsocketPayload";

@singleton()
export class AuthWebsocketHandler {
  constructor(
    private authRegistry: AuthRegistry
  ) { }

  @websocketEvent("athena.auth", joi.string().required())
  async auth({ data, socket }: WebsocketPayload<string, BaseAuthContext>) {
    (socket as any).context = this.authRegistry.createContextFromToken(socket.request, data.toString());
    return true;
  }
}
