import { injectable } from "@aldahick/tsyringe";
import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance, RouteHandler } from "fastify";

import { BaseConfig, injectConfig } from "../config.js";
import { resolveContextGenerator } from "../index.js";
import { Logger } from "../logger.js";
import {
  getControllerInfos,
  getControllerInstances,
} from "./http-decorators.js";
import { HttpRequest, HttpResponse } from "./index.js";

type HttpHandler<Context> = (
  req: HttpRequest,
  res: HttpResponse,
  context: Context
) => Promise<unknown>;

@injectable()
export class HttpServer {
  private fastify?: FastifyInstance;

  constructor(
    @injectConfig() private readonly config: BaseConfig,
    private readonly logger: Logger
  ) {}

  async init(): Promise<FastifyInstance> {
    this.fastify = fastify();
    for (const instance of getControllerInstances()) {
      for (const info of getControllerInfos(instance)) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const callback = instance[info.propertyKey as never] as Function;
        const controllerName =
          instance.constructor.name + "." + info.propertyKey.toString();
        this.logger.debug(
          `registering http controller ${controllerName} for route ${info.route}`
        );
        this.fastify[info.method](
          info.route,
          this.buildRequestHandler(callback.bind(instance))
        );
      }
    }
    await this.fastify.register(fastifyCors);
    return this.fastify;
  }

  async start(): Promise<void> {
    const { host = "0.0.0.0", port } = this.config.http;
    await this.fastify?.listen({ port, host });
    this.logger.info(`listening on port ${port}`);
  }

  async stop(): Promise<void> {
    await this.fastify?.close();
  }

  private buildRequestHandler<Context>(
    callback: HttpHandler<Context>
  ): RouteHandler {
    const contextGenerator = resolveContextGenerator();
    return async (req, res) => {
      const context = (await contextGenerator?.generateContext(req)) as Context;
      return callback(req, res, context);
    };
  }
}
