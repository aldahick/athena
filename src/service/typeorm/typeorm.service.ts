import { singleton } from "tsyringe";
import { Connection, ConnectionOptions, createConnection, Repository } from "typeorm";
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
    const { host } = ("url" in options && options.url) ? new URL(options.url) : { host: ("host" in options ? options.host : "") };
    this.logger.info({ host }, `connect.db.${options.type}`);
  }

  getRepository<T extends { new(): any; prototype: any }>(model: T): Repository<T["prototype"]> {
    if (!this.connection) {
      throw new Error("Not connected");
    }
    return this.connection?.getRepository(model);
  }
}
