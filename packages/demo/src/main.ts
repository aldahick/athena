import "reflect-metadata";
import "./hello/index.js";

import { Application, BaseConfig, container, Logger } from "@athenajs/core";

import { Config } from "./config.js";

async function main() {
  container.register(BaseConfig, Config);
  container.registerInstance(Logger, new Logger({}));
  const app = container.resolve(Application);
  // console.log((app as any).server);
  await app.start();
}

await main();
