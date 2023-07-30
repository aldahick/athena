import process from "process";

import { container, injectable } from "./container.js";
import { GraphQLServer } from "./graphql/index.js";
import { HttpServer } from "./http/index.js";
import { Logger } from "./logger.js";

@injectable()
export class Application {
  constructor(
    private logger: Logger,
    private readonly httpServer: HttpServer,
    private readonly graphqlServer: GraphQLServer<object>,
  ) {}

  readonly start = async (): Promise<void> => {
    this.registerErrorHandlers();
    const fastify = await this.httpServer.init();
    await this.graphqlServer.start(fastify);
    await this.httpServer.start();
  };

  readonly stop = async (): Promise<void> => {
    await this.graphqlServer.stop();
    await this.httpServer.stop();
    this.unregisterErrorHandlers();
  };

  private registerErrorHandlers = (): void => {
    process.on("uncaughtException", this.handleError);
    process.on("unhandledRejection", this.handleError);
    process.on("SIGINT", this.stop);
  };

  private unregisterErrorHandlers = (): void => {
    process.off("uncaughtException", this.handleError);
    process.off("unhandledRejection", this.handleError);
    process.off("SIGINT", this.stop);
  };

  readonly handleError = (err: Error): void => {
    this.logger.error("uncaught error: " + err.stack);
  };
}

export const createApp = (): Application => container.resolve(Application);
