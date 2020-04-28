import { ReturnModelType } from "@typegoose/typegoose";
import { MongoService, singleton } from "../../..";
import { User } from "../../model/mongo/User";
import { ConfigService } from "../config";

@singleton()
export class DatabaseService {
  constructor(
    private config: ConfigService,
    private mongo: MongoService,
  ) { }

  users!: ReturnModelType<typeof User>;

  async init() {
    await this.mongo.init(this.config.mongoUrl);

    this.users = this.mongo.getModel(User, "users");
  }
}
