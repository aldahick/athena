import { ReturnModelType } from "@typegoose/typegoose";
import { ConfigService, MongoService, singleton } from "../../..";
import { User } from "../../model/mongo/User";

@singleton()
export class DatabaseService {
  constructor(
    private config: ConfigService,
    private mongo: MongoService
  ) { }

  users!: ReturnModelType<typeof User>;

  async init() {
    await this.mongo.init(this.config.mongoUrl);

    this.users = this.mongo.getModel(User, "users");
  }
}
