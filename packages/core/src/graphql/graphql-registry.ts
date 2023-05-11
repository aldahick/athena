import { promises as fs } from "node:fs";

import { injectable, injectAll } from "@aldahick/tsyringe";
import { ApolloServerOptions, BaseContext } from "@apollo/server";
import { recursiveReaddir } from "@athenajs/utils";
import { GraphQLFieldResolver } from "graphql";

import { BaseConfig } from "../config.js";
import { getResolverInfo, resolverToken } from "./graphql-decorators.js";

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
    @injectAll(resolverToken) private readonly resolverInstances: object[]
  ) {}

  async getTypeDefs(): Promise<TypeDefs> {
    if (this.typeDefs) {
      return this.typeDefs;
    }
    const schemaPaths = await Promise.all(
      this.config.graphql.schemaDirs.map(recursiveReaddir)
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
    Object.fromEntries(
      this.resolverInstances.flatMap((instance) => {
        const keys = getResolverInfo(instance);
        return Object.entries(keys).map([]);
      })
    );
  }
}
