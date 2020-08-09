import { query, singleton } from "../..";
import { IQuery } from "../graphql/types";
import { User } from "../model/mongo/User";
import { DatabaseService } from "../service/database";

@singleton()
export class UserResolver {
  constructor(
    private readonly db: DatabaseService
  ) { }

  @query()
  async users(): Promise<IQuery["users"]> {
    const users = await this.db.users.find();
    return users.map(u => u.toObject() as User).map(({ _id, ...rest }) => ({
      ...rest,
      id: _id
    }));
  }
}
