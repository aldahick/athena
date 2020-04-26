import "reflect-metadata";

import * as controllers from "./controller";
import * as athena from "..";

const main = async () => {
  const app = new athena.Application();
  app.registry.controller.register(Object.values(controllers));
  await app.start();
};

main().catch(console.error);
