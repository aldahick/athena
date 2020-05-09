import { singleton } from "tsyringe";
import { DatabaseService } from "../../service/database";
import { User } from "../../model/mongo/User";
import { HttpError } from "../../../util";

@singleton()
export class UserManager {
  constructor(
    private db: DatabaseService
  ) { }

  /**
   * Per the idea of hiding services from resolvers, this method exposes an interface to the users store
   *   without allowing the resolvers direct access / use of the DatabaseService.
   */
  async getByUsername(username: string): Promise<User> {
    const user = await this.db.users.findOne({ username });
    if (!user) {
      throw HttpError.notFound(`user username=${username} not found`);
    }
    return user;
  }
}
