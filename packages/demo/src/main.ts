import "reflect-metadata";
import "./hello/index.js";

import { Application, BaseConfig, container } from "@athenajs/core";

import { Config } from "./config.js";

async function main() {
  container.register(BaseConfig, Config);
  const app = container.resolve(Application);
  await app.start();
}

await main();
