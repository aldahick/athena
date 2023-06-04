import "dotenv/config.js";

import process from "node:process";

/**
 * To define your config, extend this class and use this.optional/required
 */
export abstract class BaseConfig {
  /**
   * examples:
   * [path.resolve(athenaUtils.getModuleDir(import.meta), '../graphql')]
   * [path.resolve(process.cwd(), 'graphql')]
   */
  abstract graphqlSchemaDirs: string[];
  abstract http: { port: number };

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
