import "reflect-metadata";
import { randomInt } from "node:crypto";
import path from "node:path";
import { getModuleDir } from "@athenajs/utils";
import { FormattedExecutionResult } from "graphql";
import { BaseConfig, config, resolveConfig } from "./config.js";
import { createApp } from "./index.js";

export const getTestBaseUrl = (config: BaseConfig) =>
  `http://localhost:${config.http.port}`;

export const fetchTestGraphql = async (baseUrl: string, query: string) => {
  const res: FormattedExecutionResult = await fetch(`${baseUrl}/graphql`, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
  return res;
};

export const createTestConfig = () => {
  const port = randomInt(10_000, 20_000);
  @config()
  class Config extends BaseConfig {
    graphqlSchemaDirs = [
      path.join(getModuleDir(import.meta), "../test/application/schema"),
    ];
    http = { port };
  }
  return resolveConfig();
};

export const withTestApp = async (
  callback: (baseUrl: string, config: BaseConfig) => Promise<void>,
) => {
  const config = createTestConfig();
  const app = createApp();
  await app.start();
  const baseUrl = getTestBaseUrl(config);
  try {
    await callback(baseUrl, config);
  } finally {
    await app.stop();
  }
};
