import { Connection, createConnection } from "mongoose";
import { getModelForClass } from "@typegoose/typegoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { singleton } from "tsyringe";

@singleton()
export class MongoService {
  private connection?: Connection;

  async init(url: string) {
    this.connection = await createConnection(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async close() {
    await this.connection?.close();
  }

  getModel<T extends AnyParamConstructor<any>>(model: T, collectionName: string) {
    return getModelForClass<any, T>(model, {
      existingConnection: this.connection,
      schemaOptions: { collection: collectionName }
    });
  }
}
