import * as bunyan from "bunyan";
import { singleton } from "tsyringe";

@singleton()
export class LoggerService {
  logger = bunyan.createLogger({
    name: "athena"
  });

  trace = this.logger.trace.bind(this.logger);
  info = this.logger.info.bind(this.logger);
  warn = this.logger.warn.bind(this.logger);
  error = this.logger.error.bind(this.logger);
  fatal = this.logger.fatal.bind(this.logger);
}
