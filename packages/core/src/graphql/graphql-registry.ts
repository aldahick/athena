import { promises as fs } from "node:fs";

import { injectable } from "@aldahick/tsyringe";
import { ApolloServerOptions, BaseContext } from "@apollo/server";
import { assign, recursiveReaddir } from "@athenajs/utils";
import { GraphQLFieldResolver } from "graphql";
import { createBatchResolver } from "graphql-resolve-batch";

import { BaseConfig } from "../config.js";
import { Logger } from "../logger.js";
import { getResolverInfo, injectResolvers } from "./graphql-decorators.js";

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
    private readonly logger: Logger,
    @injectResolvers() private readonly resolverInstances: object[]
  ) {}

  async getTypeDefs(): Promise<TypeDefs> {
    if (this.typeDefs) {
      return this.typeDefs;
    }
    this.logger.debug(
      "loading graphql type definitions from " +
        this.config.graphqlSchemaDirs.join(", ")
    );
    const schemaPaths = await Promise.all(
      this.config.graphqlSchemaDirs.map((d) => recursiveReaddir(d))
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
      const resolverInfo = getResolverInfo(instance);
      for (const [typeName, { key, batch }] of resolverInfo.entries()) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        let resolver = (instance[key as never] as Function).bind(instance);
        if (batch) {
          resolver = createBatchResolver(resolver);
        }
        assign(this.resolvers, typeName, resolver);
      }
    }
    return this.resolvers;
  }
}
