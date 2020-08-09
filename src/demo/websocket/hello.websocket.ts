import * as joi from "@hapi/joi";
import { singleton } from "tsyringe";
import { websocketEvent, WebsocketPayload } from "../..";

@singleton()
export class HelloWebsocketHandler {
  @websocketEvent("hello", joi.string().alphanum().required())
  hello({ data }: WebsocketPayload<string>): string {
    return `Hello, ${data}`;
  }
}
