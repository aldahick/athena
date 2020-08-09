import * as joi from "@hapi/joi";
import { decoratorUtils } from "../../util";

export const WEBSOCKET_METADATA_KEY = "athena.websocket";

export interface WebsocketMetadata {
  eventName: string;
  methodName: string;
  validationSchema?: joi.Schema;
}

export const websocketEvent = (
  eventName: string,
  validationSchema?: WebsocketMetadata["validationSchema"]
): MethodDecorator => (target, key): void => {
  decoratorUtils.push<WebsocketMetadata>(WEBSOCKET_METADATA_KEY, {
    eventName,
    validationSchema,
    methodName: key.toString()
  }, target);
};
