import { injectable } from "inversify";
import process from "process";
import { Logger } from "./logger.js";

@injectable()
export class Application {
  constructor(private logger: Logger) {}

  readonly start = async (): Promise<void> => {};

  readonly stop = async (err?: Error): Promise<void> => {
    if (err) {
      this.logger.error("uncaught error", err);
    }
  };

  registerErrorHandlers(): void {
    process.on("uncaughtException", this.stop);
    process.on("unhandledRejection", this.stop);
    process.on("SIGINT", this.stop);
  }
}
