import { singleton } from "tsyringe";
import { websocketEvent, WebsocketPayload } from "../..";

@singleton()
export class HelloWebsocketHandler {
  @websocketEvent("hello")
  async hello({ data }: WebsocketPayload<string, any>) {
    return `Hello, ${data}`;
  }
}
