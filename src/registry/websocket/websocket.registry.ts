import * as socketIO from "socket.io";
import { container,singleton } from "tsyringe";
import { LoggerService } from "../../service/logger";
import { DecoratorUtils } from "../../util";
import { WebServer } from "../../WebServer";
import { AuthRegistry } from "../auth";
import { WEBSOCKET_METADATA_KEY,WebsocketMetadata } from "./websocket.decorators";
import { WebsocketPayload } from "./WebsocketPayload";

type EventHandler = (payload: WebsocketPayload<any, any>) => Promise<any>;

@singleton()
export class WebsocketRegistry {
  private io?: SocketIO.Server;
  private eventHandlers: {
    [eventName: string]: EventHandler;
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
    this.logger.trace("started socket.io server");

    const eventHandlers = eventHandlerClasses.map(c => container.resolve<any>(c));
    for (const eventHandler of eventHandlers) {
      const metadatas = DecoratorUtils.get<WebsocketMetadata[]>(WEBSOCKET_METADATA_KEY, eventHandler) || [];
      for (const { eventName, methodName } of metadatas) {
        const handler = eventHandler[methodName].bind(eventHandler);
        this.eventHandlers[eventName] = handler;
      }
    }

    this.io.on("connection", this.onConnection);
  }

  private onConnection = (socket: SocketIO.Socket) => {
    const context = this.authRegistry.createContext(socket.request);
    for (const [eventName, eventHandler] of Object.entries(this.eventHandlers)) {
      socket.on(eventName, data => {
        eventHandler({ socket, data, context }).then(res => {
          if (res !== undefined) {
            socket.emit(eventName, res);
          }
        }).catch(err => {
          this.logger.error(err);
        });
      });
    }
  };
}
