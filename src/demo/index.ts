import "reflect-metadata";

import { Application, container, RedisService } from "..";
import * as controllers from "./controller";
import * as queueHandlers from "./queue";
import * as resolvers from "./resolver";
import { ConfigService } from "./service/config";
import { DatabaseService } from "./service/database";
import * as websocketHandlers from "./websocket";

const main = async (): Promise<void> => {
  const app = new Application();

  const db = container.resolve(DatabaseService);
  await db.init();

  app.registry.controller.register(Object.values(controllers));
  await app.registry.resolver.register(Object.values(resolvers), {
    // __dirname = "~/dist/demo/"
    schemaDir: `${__dirname}/../../src/demo/graphql`
  });

  await app.start();

  app.registry.websocket.register(Object.values(websocketHandlers));

  const config = container.resolve(ConfigService);
  const redis = container.resolve(RedisService);
  await redis.init(config.redisUrl);
  await app.registry.queue.register(Object.values(queueHandlers));
};

// eslint-disable-next-line no-console
main().catch(console.error);
