import * as joi from "@hapi/joi";
import * as socketIO from "socket.io";
import { container,singleton } from "tsyringe";
import { LoggerService } from "../../service/logger";
import { DecoratorUtils } from "../../util";
import { WebServer } from "../../WebServer";
import { AuthRegistry } from "../auth";
import { AuthWebsocketHandler } from "./auth.websocket";
import { WEBSOCKET_METADATA_KEY,WebsocketMetadata } from "./websocket.decorators";
import { WebsocketPayload } from "./WebsocketPayload";

@singleton()
export class WebsocketRegistry {
  io!: SocketIO.Server;
  private eventHandlers: {
    [eventName: string]: {
      validationSchema?: joi.Schema;
      handle: (payload: WebsocketPayload<any, any>) => Promise<any>;
    };
  } = {};

  constructor(
    private authRegistry: AuthRegistry,
    private logger: LoggerService,
    private webServer: WebServer
  ) { }

  /** must call this after WebServer.start() */
  register(eventHandlerClasses: any[]) {
    if (!this.webServer.httpServer) {
      throw new Error("Web server must be started before websockets can be registered");
    }
    this.io = socketIO(this.webServer.httpServer);

    const eventHandlers = eventHandlerClasses.map(c => container.resolve<any>(c)).concat([
      container.resolve(AuthWebsocketHandler)
    ]);
    for (const eventHandler of eventHandlers) {
      const metadatas = DecoratorUtils.get<WebsocketMetadata[]>(WEBSOCKET_METADATA_KEY, eventHandler) || [];
      for (const { eventName, methodName, validationSchema } of metadatas) {
        this.eventHandlers[eventName] = {
          validationSchema,
          handle: eventHandler[methodName].bind(eventHandler)
        };
        this.logger.trace({
          eventName,
          methodName,
          className: eventHandler.constructor.name,
        }, "register.websocketEvent");
      }
    }

    this.io.on("connection", this.onConnection);
  }

  private onConnection = (socket: SocketIO.Socket) => {
    (socket as any).context = this.authRegistry.createContextFromToken(socket.request, undefined);
    for (const [eventName, { validationSchema, handle }] of Object.entries(this.eventHandlers)) {
      socket.on(eventName, async data => {
        try {
          if (validationSchema) {
            try {
              await validationSchema.validateAsync(data);
            } catch (validationError) {
              return socket.emit("athena.error", validationError.message);
            }
          }
          const res = await handle({
            socket,
            data,
            context: (socket as any).context
          });
          if (res !== undefined) {
            socket.emit(eventName, res);
          }
        } catch (err) {
          socket.emit("athena.error", err.message);
        }
      });
    }
  };
}
