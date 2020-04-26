import * as express from "express";
import { singleton, container } from "tsyringe";
import { WebServer } from "../../WebServer";
import { LoggerService } from "../../service/logger";
import { HttpError } from "../../util";
import { ControllerMetadata, CONTROLLER_METADATA_KEY } from "./controller.decorators";
import { ControllerPayload } from "./ControllerPayload";

@singleton()
export class ControllerRegistry {
  constructor(
    private logger: LoggerService,
    private webServer: WebServer
  ) { }

  register(controllers: any[]) {
    if (!this.webServer.express) {
      this.logger.error("Express not instantiated before controller registration");
      return;
    }
    for (const controller of controllers.map(c => container.resolve<any>(c))) {
      const metadatas = this.getMetadatas(controller);
      for (const metadata of metadatas) {
        const routeHandler = this.buildRouteHandler(controller[metadata.methodName].bind(controller));
        this.logger.info(metadata, "register.controller");
        this.webServer.express[metadata.httpMethod](metadata.route, routeHandler);
      }
    }
  }

  private buildRouteHandler(callback: (payload: ControllerPayload) => Promise<any>) {
    return async (req: express.Request, res: express.Response) => {
      try {
        let result: any;
        try {
          result = await callback({ req, res });
        } catch (err) {
          if (err instanceof HttpError) {
            res.status(err.status).send({ error: err.message });
          } else {
            // handle as internal error
            throw err;
          }
          return;
        }
        if (result !== undefined) {
          res.send(result);
        }
      } catch (err) {
        this.logger.error(err);
        res.status(500).send({ error: err.message });
      }
    };
  }

  private getMetadatas(target: any) {
    const metadatas: ControllerMetadata[] | undefined = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
    return metadatas || [];
  }
}
