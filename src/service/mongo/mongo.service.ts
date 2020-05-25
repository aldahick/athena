import { getModelForClass, prop } from "@typegoose/typegoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { Connection, createConnection } from "mongoose";
import * as randomstring from "randomstring";
import { singleton } from "tsyringe";
import { LoggerService } from "../logger";

@singleton()
export class MongoService {
  private connection?: Connection;

  constructor(
    private logger: LoggerService
  ) { }

  async init(url: string) {
    this.connection = await createConnection(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const { host } = new URL(url);
    this.logger.info({ host }, "connect.db.mongo");
  }

  async close() {
    await this.connection?.close();
  }

  getModel<T extends AnyParamConstructor<any>>(model: T, collectionName: string) {
    if (!this.connection) {
      throw new Error("Not connected");
    }
    return getModelForClass<any, T>(model, {
      existingConnection: this.connection,
      schemaOptions: { collection: collectionName }
    });
  }

  static idProp = (...props: Parameters<typeof prop>) => prop({
    default: () => randomstring.generate(16),
    required: true,
    ...props
  });
}
