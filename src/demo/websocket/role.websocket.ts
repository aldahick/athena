import { singleton } from "tsyringe";
import { guard,websocketEvent } from "../..";
import { DatabaseService } from "../service/database";

@singleton()
export class RoleWebsocketHandler {
  constructor(
    private db: DatabaseService
  ) { }

  @guard({
    resource: "role",
    action: "readAny"
  })
  @websocketEvent("roles")
  async roles() {
    return this.db.roles.find();
  }
}
