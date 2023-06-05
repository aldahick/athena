import { injectable } from "@aldahick/tsyringe";
import winston from "winston";

import { BaseConfig, injectConfig } from "./config.js";

const WinstonLogger = winston.createLogger as unknown as typeof winston.Logger;

export type LoggerOptions = winston.LoggerOptions;

@injectable()
export class Logger extends WinstonLogger {
  constructor(@injectConfig() config: BaseConfig) {
    super({
      transports: [new winston.transports.Console()],
      ...config.log,
    });
  }
}
