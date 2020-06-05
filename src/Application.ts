import { EventEmitter } from "events";
import { container } from "tsyringe";
import { ControllerRegistry } from "./registry/controller";
import { ResolverRegistry } from "./registry/resolver";
import { WebsocketRegistry } from "./registry/websocket";
import { LoggerService } from "./service/logger";
import { WebServer } from "./WebServer";

export class Application extends EventEmitter {
  private logger = container.resolve(LoggerService);
  readonly registry = {
    controller: container.resolve(ControllerRegistry),
    resolver: container.resolve(ResolverRegistry),
    websocket: container.resolve(WebsocketRegistry)
  };
  readonly webServer = container.resolve(WebServer);

  constructor(
    { registerStopHandlers = true }: { registerStopHandlers?: boolean } = { }
  ) {
    super();
    if (registerStopHandlers) {
      process.on("uncaughtException", err => this.stop(err));
      process.on("unhandledRejection", err => this.stop(err));
      process.on("SIGINT", () => this.stop());
    }
  }

  async start() {
    this.emit("start");
    await this.webServer.start();
  }

  async stop(err?: any) {
    this.emit("stop");
    if (err) {
      this.logger.error(err, "app.uncaught");
    }
    await this.webServer.stop();
  }
}
