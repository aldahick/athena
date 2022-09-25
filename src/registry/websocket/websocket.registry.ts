import * as joi from "joi";
import * as _ from "lodash";
import * as socketIO from "socket.io";
import { container, InjectionToken, singleton } from "tsyringe";

import { LoggerService } from "../../service/logger";
import { decoratorUtils } from "../../util";
import { WebServer } from "../../WebServer";
import { AuthRegistry, BaseAuthContext } from "../auth";
import { AuthWebsocketHandler } from "./auth.websocket";
import { WEBSOCKET_METADATA_KEY, WebsocketMetadata } from "./websocket.decorators";
import { WebsocketPayload } from "./WebsocketPayload";
import { WebsocketWithContext } from "./WebsocketWithContext";

interface EventHandlerMetadata {
  validationSchema?: joi.Schema;
  handle: WebsocketHandler;
}
type WebsocketHandler = (payload: WebsocketPayload<unknown>) => Promise<unknown>;

@singleton()
export class WebsocketRegistry {
  io!: socketIO.Server;

  private eventHandlers: {
    [eventName: string]: EventHandlerMetadata;
  } = {};

  constructor(private readonly authRegistry: AuthRegistry, private readonly logger: LoggerService, private readonly webServer: WebServer) {}

  /** must call this after WebServer.start() */
  register(eventHandlerClasses: unknown[]): void {
    if (!this.webServer.httpServer) {
      throw new Error("Web server must be started before websockets can be registered");
    }
    this.io = new socketIO.Server(this.webServer.httpServer);

    const eventHandlers = _.compact(eventHandlerClasses.map((c) => container.resolve<unknown>(c as InjectionToken))).concat([
      container.resolve(AuthWebsocketHandler)
    ]) as Record<string, unknown>[];
    for (const eventHandler of eventHandlers) {
      const metadatas = decoratorUtils.get<WebsocketMetadata[]>(WEBSOCKET_METADATA_KEY, eventHandler) ?? [];
      for (const { eventName, methodName, validationSchema } of metadatas) {
        if (typeof eventHandler !== "object") {
          continue;
        }
        const callback = eventHandler[methodName];
        if (typeof callback !== "function") {
          continue;
        }
        this.eventHandlers[eventName] = {
          validationSchema,
          handle: callback.bind(eventHandler) as WebsocketHandler
        };
        this.logger.trace(
          {
            eventName,
            methodName,
            className: eventHandler.constructor.name
          },
          "register.websocketEvent"
        );
      }
    }

    this.io.on("connection", this.onConnection);
  }

  private readonly onConnection = (socket: socketIO.Socket & {
    context?: BaseAuthContext;
  }): void => {
    socket.context = this.authRegistry.createContextFromToken(socket.request, undefined);
    for (const [eventName, metadata] of Object.entries(this.eventHandlers)) {
      socket.on(eventName, (data: unknown) => {
        this.fireData({
          socket: socket as WebsocketWithContext,
          metadata,
          eventName,
          data
        }).catch((err: unknown) => {
          socket.emit("athena.error", err instanceof Error ? err.message : err);
        });
      });
    }
  };

  private async fireData({
    socket,
    eventName,
    data,
    metadata: { validationSchema, handle }
  }: {
    socket: WebsocketWithContext;
    metadata: EventHandlerMetadata;
    eventName: string;
    data: unknown;
  }): Promise<void> {
    if (validationSchema) {
      try {
        await validationSchema.validateAsync(data);
      } catch (validationError) {
        socket.emit("athena.error", validationError instanceof Error ? validationError.message : validationError);
        return;
      }
    }
    const res = await handle({
      socket,
      data,
      context: socket.context
    });
    if (res !== undefined) {
      socket.emit(eventName, res);
    }
  }
}
