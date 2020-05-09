import { query, singleton, guard } from "../..";
import { IQuery } from "../graphql/types";
import { DatabaseService } from "../service/database";

@singleton()
export class RoleResolver {
  constructor(
    private db: DatabaseService
  ) { }

  @guard({
    resource: "role",
    action: "readAny"
  })
  @query()
  roles(): Promise<IQuery["roles"]> {
    return this.db.roles.find();
  }
}
