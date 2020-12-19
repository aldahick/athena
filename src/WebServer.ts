import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import { singleton } from "tsyringe";

import { BaseConfigService } from "./service/config";
import { LoggerService } from "./service/logger";

@singleton()
export class WebServer {
  express = express();

  httpServer?: http.Server;

  constructor(
    private readonly baseConfig: BaseConfigService,
    private readonly logger: LoggerService
  ) {
    this.express.use(cors());
  }

  async start(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.httpServer = this.express.listen(this.httpPort, (err?: unknown) =>
        err !== undefined ? reject(err) : resolve()
      );
    });
    this.logger.info({ port: this.httpPort }, "webServer.start");
  }

  async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this.httpServer) {
        return resolve();
      }
      this.httpServer.close(err =>
        err ? reject(err) : resolve()
      );
    });
    this.logger.info("webServer.stop");
  }

  private get httpPort(): number {
    const { httpPort } = this.baseConfig;
    if (httpPort === undefined) {
      throw new Error("Missing required environment variable HTTP_PORT");
    }
    return httpPort;
  }
}
