import "reflect-metadata";

import * as controllers from "./controller";
import * as resolvers from "./resolver";
import * as athena from "..";

const main = async () => {
  const app = new athena.Application();
  app.registry.controller.register(Object.values(controllers));
  console.log(__dirname);
  await app.registry.resolver.register(Object.values(resolvers), {
    // __dirname = "~/dist/demo/"
    schemaDir: `${__dirname}/../../src/demo/graphql`
  });
  await app.start();
};

main().catch(console.error);
