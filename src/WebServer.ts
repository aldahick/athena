import * as http from "http";
import * as cors from "cors";
import * as express from "express";
import { singleton } from "tsyringe";
import { LoggerService } from "./service/logger";
import { BaseConfigService } from "./service/config";

@singleton()
export class WebServer {
  express = express();
  httpServer?: http.Server;

  constructor(
    private baseConfig: BaseConfigService,
    private logger: LoggerService
  ) {
    this.express.use(cors());
  }

  async start() {
    await new Promise((resolve, reject) => {
      this.httpServer = this.express.listen(this.baseConfig.httpPort, err =>
        err ? reject(err) : resolve()
      );
    });
    this.logger.info({ port: this.baseConfig.httpPort }, "webServer.start");
  }

  async stop() {
    await new Promise((resolve, reject) => {
      if (!this.httpServer) {
        return resolve();
      }
      this.httpServer.close(err =>
        err ? reject(err) : resolve()
      );
    });
    this.logger.info("webServer.stop");
  }
}
