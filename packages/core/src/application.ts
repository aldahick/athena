import process from "process";
import { injectable } from "tsyringe";

import { GraphQLServer } from "./index.js";
import { Logger } from "./logger.js";

@injectable()
export class Application {
  constructor(private logger: Logger, private server: GraphQLServer) {}

  readonly start = async (): Promise<void> => {
    this.registerErrorHandlers();
    await this.server.start();
  };

  readonly stop = async (): Promise<void> => {
    await this.server.stop();
  };

  private registerErrorHandlers = (): void => {
    process.on("uncaughtException", this.handleError);
    process.on("unhandledRejection", this.handleError);
    process.on("SIGINT", this.stop);
  };

  private handleError = (err: Error): void => {
    this.logger.error("uncaught error: " + err.stack);
  };
}
