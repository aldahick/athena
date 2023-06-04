import { resolve } from "node:path";

import { BaseConfig } from "@athenajs/core";
import { getModuleDir } from "@athenajs/utils";

export class Config extends BaseConfig {
  readonly graphqlSchemaDirs = [
    resolve(getModuleDir(import.meta), "../schema"),
  ];
}
