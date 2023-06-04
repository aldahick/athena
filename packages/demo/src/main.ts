import "reflect-metadata";
import "./hello/index.js";
import "./user/index.js";

import { Application, BaseConfig, container, Logger } from "@athenajs/core";
import { isModuleMain } from "@athenajs/utils";

import { Config } from "./config.js";

export const main = async (): Promise<Application> => {
  container.registerInstance(Logger, new Logger({}));
  const config = new Config();
  container.registerInstance(Config, config);
  container.registerSingleton(BaseConfig, Config);
  const app = container.resolve(Application);
  await app.start();
  return app;
};

/* c8 ignore next 3 */
if (isModuleMain(import.meta)) {
  await main();
}
