import { singleton } from "tsyringe";
import { guard, websocketEvent } from "../..";
import { Role } from "../model/postgres";
import { DatabaseService } from "../service/database";

@singleton()
export class RoleWebsocketHandler {
  constructor(
    private readonly db: DatabaseService
  ) { }

  @guard({
    resource: "role",
    action: "readAny"
  })
  @websocketEvent("roles")
  async roles(): Promise<Role[]> {
    return this.db.roles.find();
  }
}
