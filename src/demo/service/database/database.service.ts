import { ReturnModelType } from "@typegoose/typegoose";
import { Repository } from "typeorm";
import { MongoService, singleton, TypeormService } from "../../..";
import { User } from "../../model/mongo/User";
import * as postgresModels from "../../model/postgres";
import { ConfigService } from "../config";

@singleton()
export class DatabaseService {
  constructor(
    private config: ConfigService,
    private mongo: MongoService,
    private typeorm: TypeormService
  ) { }

  roles!: Repository<postgresModels.Role>;

  users!: ReturnModelType<typeof User>;

  async init() {
    await this.mongo.init(this.config.mongoUrl);
    this.users = this.mongo.getModel(User, "users");

    await this.typeorm.init({
      entities: Object.values(postgresModels),
      type: "postgres",
      url: this.config.postgresUrl
    });
    this.roles = this.typeorm.getRepository(postgresModels.Role);
  }
}
