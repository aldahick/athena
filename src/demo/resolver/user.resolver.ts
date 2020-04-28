import { singleton, query } from "../..";
import { IQuery } from "../graphql/types";
import { DatabaseService } from "../service/database";

@singleton()
export class UserResolver {
  constructor(
    private db: DatabaseService
  ) { }

  @query()
  async users(): Promise<IQuery["users"]> {
    return this.db.users.find();
  }
}
