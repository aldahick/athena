import { ApolloServer } from "apollo-server-express";
import * as fs from "fs-extra";
import * as recursiveReaddir from "recursive-readdir";
import { container,singleton } from "tsyringe";
import { LoggerService } from "../../service/logger";
import { DecoratorUtils } from "../../util";
import { WebServer } from "../../WebServer";
import { AuthRegistry } from "../auth";
import { RESOLVER_METADATA_KEY,ResolverMetadata } from "./resolver.decorators";

@singleton()
export class ResolverRegistry {
  constructor(
    private authRegistry: AuthRegistry,
    private logger: LoggerService,
    private webServer: WebServer
  ) { }

  async register(resolverClasses: any[], options: { schemaDir: string }) {
    if (!this.webServer.express) {
      this.logger.error("resolver.registerBeforeExpress");
      return;
    }
    const resolvers: {[key: string]: {[key: string]: (...args: any[]) => any}} = {};
    for (const resolver of resolverClasses.map(r => container.resolve<any>(r))) {
      const metadatas = DecoratorUtils.get<ResolverMetadata[]>(RESOLVER_METADATA_KEY, resolver) || [];
      for (const metadata of metadatas) {
        if (!resolvers[metadata.type]) {
          resolvers[metadata.type] = {};
        }
        resolvers[metadata.type][metadata.field] = resolver[metadata.methodName].bind(resolver);
        this.logger.trace({ ...metadata, className: resolver.name }, "register.resolver");
      }
    }
    const typeDefs = (await Promise.all(
      (await recursiveReaddir(options.schemaDir))
        .filter(f => f.endsWith(".gql"))
        .map(filename => fs.readFile(filename))
    )).join("\n");
    const apollo = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => this.authRegistry.createContext(req)
    });
    apollo.applyMiddleware({ app: this.webServer.express });
  }
}
