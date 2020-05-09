import { singleton } from "tsyringe";
import { mutation } from "../..";
import { IMutationCreateAuthTokenArgs, IMutation } from "../graphql/types";
import { UserManager } from "../manager/user";
import { AuthManager } from "../manager/auth";

@singleton()
export class AuthResolver {
  constructor(
    private authManager: AuthManager,
    private userManager: UserManager
  ) { }

  @mutation()
  async createAuthToken(root: void, { username }: IMutationCreateAuthTokenArgs): Promise<IMutation["createAuthToken"]> {
    const user = await this.userManager.getByUsername(username);
    return this.authManager.createToken(user);
  }
}
