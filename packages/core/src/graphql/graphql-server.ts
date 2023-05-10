import { ApolloServer, BaseContext } from "@apollo/server";
import fastify from "fastify";
import { ResolverRegistry } from "./resolver-registry.js";

export class GraphQLServer {
  private readonly fastify?: fastify.FastifyInstance;
  private apollo?: ApolloServer<BaseContext>;

  constructor(private resolverRegistry: ResolverRegistry) {}

  async start(): Promise<void> {
    this.apollo = new ApolloServer({
      typeDefs: await this.resolverRegistry.getTypeDefs(),
    });
  }
}
