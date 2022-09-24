import * as joi from "joi";
import { singleton } from "tsyringe";

import { AuthRegistry } from "../auth";
import { websocketEvent } from "./websocket.decorators";
import { WebsocketPayload } from "./WebsocketPayload";

@singleton()
export class AuthWebsocketHandler {
  constructor(private readonly authRegistry: AuthRegistry) {}

  @websocketEvent("athena.auth", joi.string().required())
  auth({ data, socket }: WebsocketPayload<string>): boolean {
    socket.context = this.authRegistry.createContextFromToken(socket.request, data.toString());
    return true;
  }
}
