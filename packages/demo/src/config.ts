import { resolve } from "node:path";

import { BaseConfig, config } from "@athenajs/core";
import { getModuleDir } from "@athenajs/utils";

@config()
export class Config extends BaseConfig {
  readonly graphqlSchemaDirs = [
    resolve(getModuleDir(import.meta), "../schema"),
  ];
  http = {
    port: Number(this.required("HTTP_PORT")),
  };
}
