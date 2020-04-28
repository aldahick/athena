import "reflect-metadata";

import * as controllers from "./controller";
import * as resolvers from "./resolver";
import { DatabaseService } from "./service/database";
import { Application, container } from "..";

const main = async () => {
  const app = new Application();

  const db = container.resolve(DatabaseService);
  await db.init();

  app.registry.controller.register(Object.values(controllers));
  await app.registry.resolver.register(Object.values(resolvers), {
    // __dirname = "~/dist/demo/"
    schemaDir: `${__dirname}/../../src/demo/graphql`
  });

  await app.start();
};

main().catch(console.error);
