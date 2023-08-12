import "dotenv/config.js";

import process from "node:process";

import { container, inject, makeRegistryDecorator } from "./container.js";
import { LoggerOptions } from "./logger.js";

const configToken = Symbol("Config");

/**
 * Registers a class to provide config to the server. It should extend {@link BaseConfig}
 */
export const config = makeRegistryDecorator(configToken);

export const injectConfig = (): ParameterDecorator => inject(configToken);
export const resolveConfig = (): BaseConfig => container.resolve(configToken);

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
  abstract http: {
    /** Defaults to "0.0.0.0" */
    host?: string;
    port: number;
  };
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
