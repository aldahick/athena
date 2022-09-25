import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { singleton } from "tsyringe";
import { DataSource, DataSourceOptions, ObjectLiteral, Repository } from "typeorm";

import { LoggerService } from "../logger";

@singleton()
export class TypeormService {
  connection?: DataSource;

  constructor(private readonly logger: LoggerService) {}

  async init(options: DataSourceOptions): Promise<DataSource> {
    this.connection = await new DataSource(options).initialize();
    const { host } = "url" in options && options.url !== undefined ? new URL(options.url) : { host: "host" in options ? options.host : "" };
    this.logger.info({ host }, `connect.db.${options.type}`);
    return this.connection;
  }

  async close(): Promise<void> {
    await this.connection?.close();
  }

  getRepository<T extends AnyParamConstructor<P>, P extends ObjectLiteral>(model: T): Repository<P> {
    if (!this.connection) {
      throw new Error("Not connected");
    }
    return this.connection.getRepository<P>(model);
  }
}
