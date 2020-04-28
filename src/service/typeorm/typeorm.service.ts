import { singleton } from "tsyringe";
import { createConnection, Connection, ConnectionOptions, Repository } from "typeorm";
import { LoggerService } from "../logger";

@singleton()
export class TypeormService {
  private connection?: Connection;

  constructor(
    private logger: LoggerService
  ) { }

  async init(options: ConnectionOptions) {
    this.connection = await createConnection({
      synchronize: true,
      ...options
    });
    this.logger.info(`connected to ${options.type} database`);
  }

  getRepository<T extends Function>(model: T): Repository<T["prototype"]> {
    if (!this.connection) {
      throw new Error("Not connected");
    }
    return this.connection?.getRepository(model);
  }
}
