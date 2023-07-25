import { injectable } from "@aldahick/tsyringe";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
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
  context: Context,
) => Promise<unknown>;

@injectable()
export class HttpServer {
  private fastify = fastify();

  constructor(
    @injectConfig() private readonly config: BaseConfig,
    private readonly logger: Logger,
  ) {}

  async init(): Promise<FastifyInstance> {
    await this.fastify.register(fastifyCors);
    await this.fastify.register(fastifyMultipart);
    for (const instance of getControllerInstances()) {
      for (const info of getControllerInfos(instance)) {
        const callback: HttpHandler<unknown> =
          instance[info.propertyKey as never];
        const controllerName =
          instance.constructor.name + "." + info.propertyKey.toString();
        this.logger.debug(
          `registering http controller ${controllerName} for route ${info.route}`,
        );
        this.fastify[info.method](
          info.route,
          this.buildRequestHandler(callback.bind(instance)),
        );
      }
    }
    return this.fastify;
  }

  async start(): Promise<void> {
    const { host = "localhost", port } = this.config.http;
    await this.fastify.listen({ port, host });
    this.logger.info(`listening on port ${port}`);
  }

  async stop(): Promise<void> {
    await this.fastify.close();
  }

  private buildRequestHandler<Context>(
    callback: HttpHandler<Context>,
  ): RouteHandler {
    const contextGenerator = resolveContextGenerator();
    return async (req, res) => {
      const context = (await contextGenerator?.generateContext(req)) as Context;
      return callback(req, res, context);
    };
  }
}
