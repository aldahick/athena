import { injectable } from "tsyringe";
import winston from "winston";
import { BaseConfig, injectConfig } from "./config.js";

const WinstonLogger = winston.createLogger as unknown as typeof winston.Logger;

export type LoggerOptions = winston.LoggerOptions & {
  pretty?: boolean;
};

@injectable()
export class Logger extends WinstonLogger {
  constructor(@injectConfig() config: BaseConfig) {
    super({
      transports: [new winston.transports.Console()],
      format: config.log?.pretty
        ? winston.format.simple()
        : winston.format.json(),
      ...config.log,
    });
  }
}
