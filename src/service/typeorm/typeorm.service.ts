import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { singleton } from "tsyringe";
import { Connection, ConnectionOptions, createConnection, Repository } from "typeorm";
import { LoggerService } from "../logger";

@singleton()
export class TypeormService {
  connection?: Connection;

  constructor(
    private readonly logger: LoggerService
  ) { }

  async init(options: ConnectionOptions): Promise<Connection> {
    this.connection = await createConnection({
      synchronize: true,
      ...options
    });
    const { host } = "url" in options && options.url !== undefined ? new URL(options.url) : { host: "host" in options ? options.host : "" };
    this.logger.info({ host }, `connect.db.${options.type}`);
    return this.connection;
  }

  async close(): Promise<void> {
    await this.connection?.close();
  }

  getRepository<T extends AnyParamConstructor<P>, P>(model: T): Repository<P> {
    if (!this.connection) {
      throw new Error("Not connected");
    }
    return this.connection.getRepository(model);
  }
}
