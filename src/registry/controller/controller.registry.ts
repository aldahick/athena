import * as express from "express";
import { container, InjectionToken, singleton } from "tsyringe";
import { LoggerService } from "../../service/logger";
import { decoratorUtils, HttpError } from "../../util";
import { WebServer } from "../../WebServer";
import { AuthRegistry } from "../auth";
import { CONTROLLER_METADATA_KEY, ControllerMetadata } from "./controller.decorators";
import { ControllerPayload } from "./ControllerPayload";

@singleton()
export class ControllerRegistry {
  constructor(
    private readonly authRegistry: AuthRegistry,
    private readonly logger: LoggerService,
    private readonly webServer: WebServer
  ) { }

  register(controllerClasses: unknown[]): void {
    const controllers = controllerClasses.map(c => container.resolve<Record<string, unknown>>(c as InjectionToken));
    for (const controller of controllers) {
      if (typeof controller !== "object") {
        continue;
      }
      const metadatas = decoratorUtils.get<ControllerMetadata[]>(CONTROLLER_METADATA_KEY, controller) ?? [];
      for (const metadata of metadatas) {
        const callback = controller[metadata.methodName];
        if (typeof callback !== "function") {
          continue;
        }
        const routeHandler = this.buildRouteHandler(callback.bind(controller));
        this.logger.trace({ ...metadata, className: controller.name }, "register.controller");
        this.webServer.express[metadata.httpMethod](metadata.route, routeHandler);
      }
    }
  }

  private buildRouteHandler(callback: (payload: ControllerPayload) => Promise<unknown>) {
    return async (req: express.Request, res: express.Response): Promise<void> => {
      try {
        const result = await callback({
          req,
          res,
          context: this.authRegistry.createContext(req)
        });
        if (result !== undefined) {
          res.send(result);
        }
      } catch (err) {
        this.logger.error(err);
        const httpErr = err instanceof HttpError
          ? err
          : HttpError.internalError(err instanceof Error
            ? err.message
            : err
          );
        res.status(httpErr.status).send({
          error: httpErr.message
        });
      }
    };
  }
}
