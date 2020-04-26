import * as http from "http";
import * as cors from "cors";
import * as express from "express";
import { singleton } from "tsyringe";
import { LoggerService } from "./service/logger";
import { ConfigService } from "./service/config";

@singleton()
export class WebServer {
  express = express();
  httpServer?: http.Server;

  constructor(
    private config: ConfigService,
    private logger: LoggerService
  ) {
    this.express.use(cors());
  }

  async start() {
    await new Promise((resolve, reject) => {
      this.httpServer = this.express.listen(this.config.httpPort, err =>
        err ? reject(err) : resolve()
      );
    });
    this.logger.info({ port: this.config.httpPort }, "webServer.start");
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
