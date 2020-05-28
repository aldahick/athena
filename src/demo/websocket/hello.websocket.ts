import * as joi from "@hapi/joi";
import { singleton } from "tsyringe";
import { websocketEvent, WebsocketPayload } from "../..";

@singleton()
export class HelloWebsocketHandler {
  @websocketEvent("hello", joi.string().alphanum().required())
  async hello({ data }: WebsocketPayload<string, any>) {
    return `Hello, ${data}`;
  }
}
