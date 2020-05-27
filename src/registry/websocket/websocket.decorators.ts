import { DecoratorUtils } from "../../util";

export const WEBSOCKET_METADATA_KEY = "athena.websocket";

export interface WebsocketMetadata {
  eventName: string;
  methodName: string;
}

export const websocketEvent = (eventName: string) => (target: any, key: string | symbol) => {
  DecoratorUtils.push<WebsocketMetadata>(WEBSOCKET_METADATA_KEY, {
    eventName,
    methodName: key.toString()
  }, target);
};
