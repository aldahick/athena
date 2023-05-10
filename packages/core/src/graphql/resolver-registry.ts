import { ApolloServerOptions, BaseContext } from "@apollo/server";
import { injectable } from "inversify";
import { promises as fs } from "node:fs";
import { recursiveReaddir } from "@athenajs/utils";

export interface ResolverRegistryOptions {
  schemaDirs: string[];
  resolverClasses: (new () => object)[];
}

export type TypeDefs = Exclude<
  ApolloServerOptions<BaseContext>["typeDefs"],
  undefined
>;

@injectable()
export class ResolverRegistry {
  constructor(private options: ResolverRegistryOptions) {}

  private typeDefs?: TypeDefs;
  async getTypeDefs(): Promise<TypeDefs> {
    if (this.typeDefs) {
      return this.typeDefs;
    }
    const schemaPaths = await Promise.all(
      this.options.schemaDirs.map(recursiveReaddir)
    );
    return (this.typeDefs = await Promise.all(
      schemaPaths.flat().map((path) => fs.readFile(path, "utf-8"))
    ));
  }
}
