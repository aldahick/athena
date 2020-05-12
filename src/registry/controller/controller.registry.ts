import * as express from "express";
import { singleton, container } from "tsyringe";
import { WebServer } from "../../WebServer";
import { LoggerService } from "../../service/logger";
import { HttpError, DecoratorUtils } from "../../util";
import { AuthRegistry } from "../auth";
import { ControllerMetadata, CONTROLLER_METADATA_KEY } from "./controller.decorators";
import { ControllerPayload } from "./ControllerPayload";

@singleton()
export class ControllerRegistry {
  constructor(
    private authRegistry: AuthRegistry,
    private logger: LoggerService,
    private webServer: WebServer
  ) { }

  register(controllers: any[]) {
    if (!this.webServer.express) {
      this.logger.error("controller.registerBeforeExpress");
      return;
    }
    for (const controller of controllers.map(c => container.resolve<any>(c))) {
      const metadatas = DecoratorUtils.get<ControllerMetadata[]>(CONTROLLER_METADATA_KEY, controller) || [];
      for (const metadata of metadatas) {
        const routeHandler = this.buildRouteHandler(controller[metadata.methodName].bind(controller));
        this.logger.trace({ ...metadata, className: controller.name }, "register.controller");
        this.webServer.express[metadata.httpMethod](metadata.route, routeHandler);
      }
    }
  }

  private buildRouteHandler(callback: (payload: ControllerPayload<any>) => Promise<any>) {
    return async (req: express.Request, res: express.Response) => {
      try {
        let result: any;
        try {
          result = await callback({
            req,
            res,
            context: this.authRegistry.createContext(req)
          });
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
}
