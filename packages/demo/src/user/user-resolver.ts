import crypto from "node:crypto";
import { resolveField, resolveQuery, resolver } from "@athenajs/core";
import { IUser } from "../graphql.js";
import { UserService } from "./user-service.js";

@resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @resolveQuery()
  async users() {
    return await this.userService.getMany();
  }

  @resolveField("User.id", true)
  id(users: IUser[]): IUser["id"][] {
    return users.map((u) =>
      crypto.createHash("md5").update(u.username).digest("hex"),
    );
  }
}
