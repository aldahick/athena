import { promises as fs } from "node:fs";

import { injectable } from "@aldahick/tsyringe";
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import { assign, recursiveReaddir } from "@athenajs/utils";
import { FastifyInstance } from "fastify";
import { GraphQLFieldResolver } from "graphql";
import { createBatchResolver } from "graphql-resolve-batch";

import { BaseConfig, injectConfig } from "../config.js";
import { Logger } from "../logger.js";
import { ContextRequest, resolveContextGenerator } from "./graphql-context.js";
import {
  getResolverInfos,
  getResolverInstances,
  ResolverInfo,
} from "./graphql-decorators.js";

export type TypeDefs = Exclude<
  ApolloServerOptions<BaseContext>["typeDefs"],
  undefined
>;

export type Resolvers = Record<
  string,
  Record<string, GraphQLFieldResolver<unknown, unknown>>
>;

@injectable()
export class GraphQLServer<Context extends BaseContext = BaseContext> {
  private apollo?: ApolloServer<Context>;
  private started = false;

  constructor(
    @injectConfig() private readonly config: BaseConfig,
    private readonly logger: Logger,
  ) {}

  async start(fastify: FastifyInstance) {
    if (this.started) {
      return;
    }
    this.apollo = new ApolloServer({
      typeDefs: await this.getTypeDefs(),
      resolvers: this.getResolvers(),
      plugins: [fastifyApolloDrainPlugin(fastify)],
    });
    await this.apollo.start();
    const contextGenerator = resolveContextGenerator();
    await fastify.register(fastifyApollo(this.apollo), {
      context: async (req) => {
        return (await contextGenerator?.generateContext(
          req as ContextRequest,
        )) as Context;
      },
    });
    this.started = true;
  }

  async stop(): Promise<void> {
    await this.apollo?.stop();
    this.apollo = undefined;
  }

  async getTypeDefs(): Promise<TypeDefs> {
    this.logger.debug(
      "loading graphql type definitions from " +
        this.config.graphqlSchemaDirs.join(", "),
    );
    const schemaPaths = await Promise.all(
      this.config.graphqlSchemaDirs.map((d) => recursiveReaddir(d)),
    );
    return Promise.all(
      schemaPaths.flat().map((path) => fs.readFile(path, "utf-8")),
    );
  }

  getResolvers(): Resolvers {
    const resolvers: Resolvers = {};
    for (const instance of getResolverInstances()) {
      for (const info of getResolverInfos(instance)) {
        const resolver = this.makeResolver(
          instance[info.propertyKey as never],
          info,
        );
        assign(resolvers, info.typeName, resolver);
      }
    }
    return resolvers;
  }

  // TODO implement error handling for scalar resolvers
  makeResolver(callback: unknown, info: ResolverInfo) {
    if (typeof callback !== "function") {
      return callback;
    }
    const resolver = async (...args: unknown[]) => {
      try {
        return await callback(...args);
      } catch (err) {
        let message = "unknown error";
        if (err instanceof Error) {
          message = err.stack || err.message;
        } else {
          if (err && (typeof err === "object" || typeof err === "string")) {
            message = err?.toString();
          }
          err = new Error(message);
        }
        this.logger.error(
          `an error occurred in GraphQL resolver ${info.typeName}: ${message}`,
        );
        throw err;
      }
    };
    return info.batch ? createBatchResolver(resolver) : resolver;
  }
}
