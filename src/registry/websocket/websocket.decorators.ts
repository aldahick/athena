import * as joi from "@hapi/joi";
import { DecoratorUtils } from "../../util";

export const WEBSOCKET_METADATA_KEY = "athena.websocket";

export interface WebsocketMetadata {
  eventName: string;
  methodName: string;
  validationSchema?: joi.Schema;
}

export const websocketEvent = (
  eventName: string,
  validationSchema?: WebsocketMetadata["validationSchema"]
) => (target: any, key: string | symbol) => {
  DecoratorUtils.push<WebsocketMetadata>(WEBSOCKET_METADATA_KEY, {
    eventName,
    validationSchema,
    methodName: key.toString()
  }, target);
};
