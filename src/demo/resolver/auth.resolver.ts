import { singleton } from "tsyringe";

import { mutation } from "../..";
import { IMutation, IMutationCreateAuthTokenArgs } from "../graphql/types";
import { AuthManager } from "../manager/auth";
import { UserManager } from "../manager/user";

@singleton()
export class AuthResolver {
  constructor(private readonly authManager: AuthManager, private readonly userManager: UserManager) {}

  @mutation()
  async createAuthToken(root: unknown, { username }: IMutationCreateAuthTokenArgs): Promise<IMutation["createAuthToken"]> {
    const user = await this.userManager.getByUsername(username);
    return this.authManager.createToken(user);
  }
}
