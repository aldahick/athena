import { promises as fs } from "node:fs";

import { injectable } from "@aldahick/tsyringe";
import { ApolloServerOptions, BaseContext } from "@apollo/server";
import { assign, recursiveReaddir } from "@athenajs/utils";
import { GraphQLFieldResolver } from "graphql";

import { BaseConfig } from "../config.js";
import { getResolverKeys, injectResolvers } from "./graphql-decorators.js";

export type TypeDefs = Exclude<
  ApolloServerOptions<BaseContext>["typeDefs"],
  undefined
>;

export type Resolvers = Record<
  string,
  Record<string, GraphQLFieldResolver<unknown, unknown>>
>;

@injectable()
export class GraphQLRegistry {
  private typeDefs?: TypeDefs;

  constructor(
    private readonly config: BaseConfig,
    @injectResolvers() private readonly resolverInstances: object[]
  ) {}

  async getTypeDefs(): Promise<TypeDefs> {
    if (this.typeDefs) {
      return this.typeDefs;
    }
    const schemaPaths = await Promise.all(
      this.config.graphqlSchemaDirs.map(recursiveReaddir)
    );
    return (this.typeDefs = await Promise.all(
      schemaPaths.flat().map((path) => fs.readFile(path, "utf-8"))
    ));
  }

  private resolvers?: Resolvers;
  getResolvers(): Resolvers {
    if (this.resolvers) {
      return this.resolvers;
    }
    this.resolvers = {};
    for (const instance of this.resolverInstances) {
      const resolverInfo = getResolverKeys(instance);
      for (const [typeName, resolverKey] of Object.entries(resolverInfo)) {
        const resolver = instance[resolverKey as never];
        assign(this.resolvers, typeName, resolver);
      }
    }
    return this.resolvers;
  }
}
