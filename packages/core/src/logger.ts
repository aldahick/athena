import { injectable } from "@aldahick/tsyringe";
import winston from "winston";

const WinstonLogger = winston.createLogger as unknown as typeof winston.Logger;

@injectable()
export class Logger extends WinstonLogger {
  constructor(options?: winston.LoggerOptions) {
    super({
      transports: [new winston.transports.Console()],
      ...options,
    });
  }
}
