import { injectable } from "@aldahick/tsyringe";
import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";

import { BaseConfig, injectConfig } from "../config.js";
import { Logger } from "../logger.js";
import {
  getControllerInfos,
  getControllerInstances,
} from "./http-decorators.js";

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
        this.fastify[info.method](info.route, callback.bind(instance));
      }
    }
    await this.fastify.register(fastifyCors);
    return this.fastify;
  }

  async start(): Promise<void> {
    const { port } = this.config.http;
    await this.fastify?.listen({ port });
    this.logger.info(`listening on port ${port}`);
  }

  async stop(): Promise<void> {
    await this.fastify?.close();
  }
}
