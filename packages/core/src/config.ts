import "dotenv/config.js";

import process from "node:process";

import { injectable } from "@aldahick/tsyringe";

import { inject, registry } from "./container.js";
import { LoggerOptions } from "./logger.js";

const configToken = Symbol("Config");

export const config = (): ClassDecorator => (target) => {
  const constructor = target as unknown as new () => unknown;
  injectable()(constructor);
  registry([{ token: configToken, useClass: constructor }])(target);
};

export const injectConfig = (): ParameterDecorator => inject(configToken);

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
  log?: LoggerOptions;

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
