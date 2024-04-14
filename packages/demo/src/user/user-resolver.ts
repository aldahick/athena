import crypto from "node:crypto";
import { resolveField, resolveQuery, resolver } from "@athenajs/core";

import { IUser } from "../graphql.js";

@resolver()
export class UserResolver {
  @resolveQuery()
  async users(): Promise<Partial<IUser>[]> {
    return [{ username: "foo" }, { username: "bar" }];
  }

  @resolveField("User.id", true)
  async id(users: Omit<IUser, "id">[]): Promise<IUser["id"][]> {
    return users.map((u) =>
      crypto.createHash("md5").update(u.username).digest("hex"),
    );
  }
}
