import { ApolloServer } from "apollo-server-express";
import * as fs from "fs-extra";
import * as recursiveReaddir from "recursive-readdir";
import { container, InjectionToken, singleton } from "tsyringe";

import { BaseConfigService } from "../../service/config";
import { LoggerService } from "../../service/logger";
import { decoratorUtils } from "../../util";
import { WebServer } from "../../WebServer";
import { AuthRegistry, BaseAuthContext } from "../auth";
import { RESOLVER_METADATA_KEY, ResolverMetadata } from "./resolver.decorators";

type ResolverCallback = (root: unknown, args: unknown, context: unknown) => unknown;

@singleton()
export class ResolverRegistry {
  constructor(
    private readonly authRegistry: AuthRegistry,
    private readonly config: BaseConfigService,
    private readonly logger: LoggerService,
    private readonly webServer: WebServer
  ) {}

  async register(resolverClasses: unknown[], options: { schemaDir: string }): Promise<void> {
    const resolversMap: {
      [key: string]: {
        [key: string]: ResolverCallback;
      };
    } = {};
    const resolvers = resolverClasses.map((r) => container.resolve<Record<string, unknown>>(r as InjectionToken));
    for (const resolver of resolvers) {
      const metadatas = decoratorUtils.get<ResolverMetadata[]>(RESOLVER_METADATA_KEY, resolver) ?? [];
      for (const metadata of metadatas) {
        if (!(metadata.type in resolversMap)) {
          resolversMap[metadata.type] = {};
        }
        const callback = resolver[metadata.methodName];
        if (typeof callback !== "function") {
          continue;
        }
        resolversMap[metadata.type][metadata.field] = callback.bind(resolver) as ResolverCallback;
        this.logger.trace({ ...metadata, className: resolver.name }, "register.resolver");
      }
    }
    const typeDefs = (
      await Promise.all((await recursiveReaddir(options.schemaDir)).filter((f) => f.endsWith(".gql")).map((filename) => fs.readFile(filename)))
    ).join("\n");
    const apollo = new ApolloServer({
      typeDefs,
      resolvers: resolversMap,
      context: ({ req }): BaseAuthContext => this.authRegistry.createContext(req)
    });
    apollo.applyMiddleware({
      app: this.webServer.express,
      bodyParserConfig: {
        limit: this.config.uploadLimit
      }
    });
  }
}
