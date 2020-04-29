import { Connection, createConnection } from "mongoose";
import { getModelForClass } from "@typegoose/typegoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
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
    this.logger.info("connected to mongo database");
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
}
