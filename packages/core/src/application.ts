import process from "process";

import { container, injectable } from "./container.js";
import { GraphQLServer } from "./graphql/index.js";
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

  readonly handleError = (err: Error): void => {
    this.logger.error("uncaught error: " + err.stack);
  };
}

export const createApp = (): Application => {
  try {
    return container.resolve(Application);
  } catch (err) {
    if (err instanceof Error) {
      if (
        err.message.includes(
          'Attempted to resolve unregistered dependency token: "Symbol(Resolver)"'
        )
      ) {
        throw new Error(
          "Cannot find any resolvers - make sure they're imported by your main file!"
        );
      }
    }
    throw err;
  }
};
