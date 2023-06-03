import { injectable } from "@aldahick/tsyringe";
import { ApolloServer, BaseContext } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import fastifyCors from "@fastify/cors";
import fastify from "fastify";

import { BaseConfig } from "../config.js";
import { Logger } from "../logger.js";
import { GraphQLRegistry } from "./graphql-registry.js";

@injectable()
export class GraphQLServer {
  private fastify?: fastify.FastifyInstance;
  private apollo?: ApolloServer<BaseContext>;

  constructor(
    private readonly config: BaseConfig,
    private readonly logger: Logger,
    private readonly registry: GraphQLRegistry
  ) {}

  async start(): Promise<void> {
    this.fastify = fastify();
    const typeDefs = await this.registry.getTypeDefs();
    const resolvers = this.registry.getResolvers();
    this.apollo = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [fastifyApolloDrainPlugin(this.fastify)],
    });
    await this.apollo.start();
    await this.fastify.register(fastifyCors);
    await this.fastify.register(fastifyApollo(this.apollo));
    const { port } = this.config.http;
    await this.fastify.listen({ port });
    this.logger.info("listening on port " + port);
  }

  async stop(): Promise<void> {
    await this.apollo?.stop();
    await this.fastify?.close();
  }
}
