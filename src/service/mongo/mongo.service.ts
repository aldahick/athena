import { getModelForClass, prop } from "@typegoose/typegoose";
import { AnyParamConstructor, ReturnModelType } from "@typegoose/typegoose/lib/types";
import { Connection, createConnection } from "mongoose";
import * as randomstring from "randomstring";
import { singleton } from "tsyringe";

import { LoggerService } from "../logger";

const DEFAULT_ID_LENGTH = 16;

@singleton()
export class MongoService {
  connection?: Connection;

  constructor(
    private readonly logger: LoggerService
  ) { }

  async init(url: string): Promise<void> {
    this.connection = await createConnection(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const { host } = new URL(url);
    this.logger.info({ host }, "connect.db.mongo");
  }

  async close(): Promise<void> {
    await this.connection?.close();
  }

  getModel<T extends AnyParamConstructor<unknown>>(model: T, collectionName: string): ReturnModelType<T> {
    if (!this.connection) {
      throw new Error("Not connected");
    }
    return getModelForClass<T>(model, {
      existingConnection: this.connection,
      schemaOptions: { collection: collectionName }
    });
  }

  static idProp(length = DEFAULT_ID_LENGTH, ...props: Parameters<typeof prop>): PropertyDecorator {
    return prop({
      default: () => randomstring.generate(length),
      required: true,
      ...props
    });
  }
}
