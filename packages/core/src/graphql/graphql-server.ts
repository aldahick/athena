import { injectable } from "@aldahick/tsyringe";
import { ApolloServer, BaseContext } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import fastify from "fastify";

import { BaseConfig } from "../config.js";
import { GraphQLRegistry } from "./graphql-registry.js";

@injectable()
export class GraphQLServer {
  private fastify?: fastify.FastifyInstance;
  private apollo?: ApolloServer<BaseContext>;

  constructor(
    private readonly config: BaseConfig,
    private readonly registry: GraphQLRegistry
  ) {}

  async start(): Promise<void> {
    this.fastify = fastify();
    this.apollo = new ApolloServer({
      typeDefs: await this.registry.getTypeDefs(),
      resolvers: this.registry.getResolvers(),
      plugins: [fastifyApolloDrainPlugin(this.fastify)],
    });
    await this.apollo.start();
    await this.fastify.register(fastifyApollo(this.apollo));
    await this.fastify.listen({ port: this.config.http.port });
  }

  async stop(): Promise<void> {
    await this.apollo?.stop();
    await this.fastify?.close();
  }
}
