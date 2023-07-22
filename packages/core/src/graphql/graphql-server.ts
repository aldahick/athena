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
import { resolveContextGenerator } from "./graphql-context.js";
import {
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

  constructor(
    @injectConfig() private readonly config: BaseConfig,
    private readonly logger: Logger,
  ) {}

  async start(fastify: FastifyInstance) {
    this.apollo = new ApolloServer({
      typeDefs: await this.getTypeDefs(),
      resolvers: this.getResolvers(),
      plugins: [fastifyApolloDrainPlugin(fastify)],
    });
    await this.apollo.start();
    const contextGenerator = resolveContextGenerator();
    await fastify.register(fastifyApollo(this.apollo), {
      context: async (req) =>
        (await contextGenerator?.generateContext(req)) as Context,
    });
  }

  async stop(): Promise<void> {
    await this.apollo?.stop();
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
        // eslint-disable-next-line @typescript-eslint/ban-types
        const callback = instance[info.propertyKey as never] as Function;
        let resolver =
          typeof callback === "function" ? callback.bind(instance) : callback;
        if (info.batch) {
          resolver = createBatchResolver(resolver);
        }
        assign(resolvers, info.typeName, resolver);
      }
    }
    return resolvers;
  }
}
