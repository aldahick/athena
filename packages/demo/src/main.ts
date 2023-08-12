import "reflect-metadata";
import "./config.js";
import "./error/index.js";
import "./hello/index.js";
import "./user/index.js";

import { Application, createApp } from "@athenajs/core";
import { isModuleMain } from "@athenajs/utils";

export const main = async (): Promise<Application> => {
  const app = createApp();
  await app.start();
  return app;
};

/* c8 ignore next 3 */
if (isModuleMain(import.meta)) {
  await main();
}
