import { ApolloServer } from "apollo-server-express";
import * as fs from "fs-extra";
import * as recursiveReaddir from "recursive-readdir";
import { singleton, container } from "tsyringe";
import { WebServer } from "../../WebServer";
import { LoggerService } from "../../service/logger";
import { DecoratorUtils } from "../../util";
import { ResolverMetadata, RESOLVER_METADATA_KEY } from "./resolver.decorators";

@singleton()
export class ResolverRegistry {
  constructor(
    private logger: LoggerService,
    private webServer: WebServer
  ) { }

  async register(resolverClasses: any[], options: { schemaDir: string }) {
    if (!this.webServer.express) {
      this.logger.error("resolver.registerBeforeExpress");
      return;
    }
    const resolvers: {[key: string]: {[key: string]: Function}} = {};
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
      resolvers
    });
    apollo.applyMiddleware({ app: this.webServer.express });
  }
}
