import { container } from "tsyringe";
import { ControllerRegistry } from "./registry/controller";
import { ResolverRegistry } from "./registry/resolver";
import { WebServer } from "./WebServer";

export class Application {
  readonly registry = {
    controller: container.resolve(ControllerRegistry),
    resolver: container.resolve(ResolverRegistry)
  };
  readonly webServer = container.resolve(WebServer);

  constructor(
    { registerStopHandlers = true }: { registerStopHandlers?: boolean } = { }
  ) {
    if (registerStopHandlers) {
      process.on("uncaughtException", () => this.stop());
      process.on("unhandledRejection", () => this.stop());
      process.on("SIGINT", () => this.stop());
    }
  }

  async start() {
    await this.webServer.start();
  }

  async stop() {
    await this.webServer.stop();
  }
}
