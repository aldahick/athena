import { promises as fs } from "node:fs";
import path from "node:path";
import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from "@aldahick/apollo-fastify";
import { ApolloServer, ApolloServerOptions, BaseContext } from "@apollo/server";
import { assignDeep } from "@athenajs/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { FastifyInstance } from "fastify";
import { GraphQLFieldResolver, Source, parse } from "graphql";
import { createBatchResolver } from "graphql-resolve-batch";
import { makeHandler } from "graphql-ws/lib/use/@fastify/websocket";
import { injectable } from "tsyringe";
import { WebSocket, createWebSocketStream } from "ws";
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
    const typeDefs = await this.getTypeDefs();
    const resolvers = this.getResolvers();
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const contextGenerator = resolveContextGenerator();

    const apollo = new ApolloServer<Context>({
      schema,
      plugins: [fastifyApolloDrainPlugin(fastify)],
    });
    this.apollo = apollo;
    await apollo.start();

    const httpHandler = fastifyApolloHandler(this.apollo, {
      context: (req) =>
        contextGenerator?.httpContext(
          req as ContextRequest,
        ) as Promise<Context>,
    });
    const wsHandler = makeHandler({
      schema,
      context: contextGenerator?.websocketContext?.bind(contextGenerator),
    });

    await fastify.register((fastify) => {
      fastify.get("/graphql", { websocket: true }, (socket, req) => {
        // graphql-ws@5.16 has mismatched types: https://github.com/enisdenjo/graphql-ws/issues/553
        const connection = createWebSocketStream(
          socket,
        ) as unknown as WebSocket & { socket: WebSocket };
        connection.socket = socket;
        return wsHandler.call(fastify, connection, req);
      });
      fastify.route({
        method: ["POST", "OPTIONS"],
        url: "/graphql",
        handler: httpHandler,
      });
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
    return await Promise.all(
      schemaPaths.map(async (schemaPath) => {
        const source = await fs.readFile(schemaPath, "utf-8");
        const name = path.basename(schemaPath);
        return parse(new Source(source, name));
      }),
    );
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

    const handleError = (err: unknown) => {
      let message = "unknown error";
      if (err instanceof Error) {
        message = err.stack || err.message;
      } else if (err && (typeof err === "object" || typeof err === "string")) {
        message = err?.toString();
      }
      this.logger.error(
        `an error occurred in GraphQL resolver ${info.typeName}: ${message}`,
      );
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(message);
    };

    const callback = resolver.bind(instance);
    const resolve = async (...args: unknown[]) => {
      try {
        return await callback(...args);
      } catch (err) {
        handleError(err);
      }
    };

    if (info.typeName.startsWith("Subscription.")) {
      return { subscribe: resolve };
    }
    return info.batch ? createBatchResolver(resolve) : resolve;
  }
}
