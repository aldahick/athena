import { promises as fs } from "node:fs";
import path from "node:path";
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import { assignDeep } from "@athenajs/utils";
import { FastifyInstance } from "fastify";
import { GraphQLFieldResolver } from "graphql";
import { createBatchResolver } from "graphql-resolve-batch";
import { injectable } from "tsyringe";
import { BaseConfig, injectConfig } from "../config.js";
import { Logger } from "../logger.js";
import { ContextRequest, resolveContextGenerator } from "./graphql-context.js";
import {
  ResolverInfo,
  getResolverInfos,
  getResolverInstances,
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
    const dirs = this.config.graphqlSchemaDirs.join(", ");
    this.logger.debug(`loading graphql type definitions from ${dirs}`);
    const schemaFiles = await Promise.all(
      this.config.graphqlSchemaDirs.map(async (d) =>
        fs.readdir(d, { recursive: true, withFileTypes: true }),
      ),
    );
    const schemaPaths = schemaFiles
      .flat()
      .map((file) => path.resolve(file.parentPath, file.name));
    return Promise.all(schemaPaths.map((path) => fs.readFile(path, "utf-8")));
  }

  getResolvers(): Resolvers {
    const resolvers: Resolvers = {};
    for (const instance of getResolverInstances()) {
      for (const info of getResolverInfos(instance)) {
        const resolver = this.makeResolver(instance, info);
        assignDeep(resolvers, info.typeName, resolver);
      }
    }
    return resolvers;
  }

  // TODO implement error handling for scalar resolvers
  makeResolver(instance: object, info: ResolverInfo) {
    const resolver = instance[info.propertyKey as never] as unknown;
    if (typeof resolver !== "function") {
      return resolver;
    }
    const callback = resolver.bind(instance);
    const resolve = async (...args: unknown[]) => {
      try {
        return await callback(...args);
      } catch (err) {
        let message = "unknown error";
        if (err instanceof Error) {
          message = err.stack || err.message;
        } else if (
          err &&
          (typeof err === "object" || typeof err === "string")
        ) {
          message = err?.toString();
        }
        this.logger.error(
          `an error occurred in GraphQL resolver ${info.typeName}: ${message}`,
        );
        if (err instanceof Error) {
          throw err;
        }
        throw new Error(message);
      }
    };
    return info.batch ? createBatchResolver(resolve) : resolve;
  }
}
