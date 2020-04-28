import { query, singleton } from "../..";
import { IQuery } from "../graphql/types";
import { DatabaseService } from "../service/database";

@singleton()
export class RoleResolver {
  constructor(
    private db: DatabaseService
  ) { }

  @query()
  roles(): Promise<IQuery["roles"]> {
    return this.db.roles.find();
  }
}
