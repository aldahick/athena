import "dotenv/config.js";

import process from "node:process";

import { injectable } from "@aldahick/tsyringe";

/**
 * To add fields,
 * TODO
 */
@injectable()
export class BaseConfig {
  /**
   * override this! for example:
   * [path.resolve(athenaUtils.getModuleDir(import.meta), '../graphql')]
   * or [path.resolve(process.cwd(), 'graphql')]
   */
  readonly graphqlSchemaDirs: string[] = [];
  readonly http = {
    port: Number(this.required("HTTP_PORT")),
  };
  protected optional(key: string): string | undefined {
    return process.env[key];
  }

  protected required(key: string): string {
    const value = this.optional(key);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
}
