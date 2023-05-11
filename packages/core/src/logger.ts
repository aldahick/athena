import { injectable } from "@aldahick/tsyringe";
import winston, { createLogger } from "winston";

const WinstonLogger = createLogger as unknown as typeof winston.Logger;

@injectable()
export class Logger extends WinstonLogger {
  constructor() {
    super({
      transports: [new winston.transports.Console()],
    });
  }
}
