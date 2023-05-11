import { resolve } from "node:path";

import { BaseConfig, injectable } from "@athenajs/core";
import { getModuleDir } from "@athenajs/utils";

@injectable()
export class Config extends BaseConfig {
  readonly graphqlSchemaDirs = [
    resolve(getModuleDir(import.meta), "../schema"),
  ];
}
