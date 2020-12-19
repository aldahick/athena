import { EventEmitter } from "events";
import { container } from "tsyringe";

import { ControllerRegistry } from "./registry/controller";
import { QueueRegistry } from "./registry/queue";
import { ResolverRegistry } from "./registry/resolver";
import { WebsocketRegistry } from "./registry/websocket";
import { LoggerService } from "./service/logger";
import { WebServer } from "./WebServer";

export class Application extends EventEmitter {

  readonly registry = {
    controller: container.resolve(ControllerRegistry),
    queue: container.resolve(QueueRegistry),
    resolver: container.resolve(ResolverRegistry),
    websocket: container.resolve(WebsocketRegistry)
  };

  readonly webServer = container.resolve(WebServer);

  private readonly logger = container.resolve(LoggerService);

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

  async start(): Promise<void> {
    this.emit("start");
    await this.webServer.start();
  }

  stop(err?: unknown): void {
    this.emit("stop");
    if (err !== undefined) {
      this.logger.error(err, "app.uncaught");
    }
    // eslint-disable-next-line no-console
    this.webServer.stop().catch(console.error);
  }
}
