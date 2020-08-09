import { Request } from "express";
import * as _ from "lodash";
import { container } from "tsyringe";
import { AuthCheck, AuthService, BaseAuthContext } from "../../..";
import { User } from "../../model/mongo/User";
import { Role } from "../../model/postgres";
import { DatabaseService } from "../../service/database";
import { DemoTokenPayload } from "./DemoTokenPayload";

export class DemoAuthContext implements BaseAuthContext {
  // null signifies "already tried to fetch"
  private _user: User | undefined | null;

  private roles?: Role[];

  constructor(
    readonly req: Request,
    readonly payload?: DemoTokenPayload
  ) { }

  async user(): Promise<User | undefined> {
    await this.fetchUserAndRoles();
    return this._user ?? undefined;
  }

  async isAuthorized(check: AuthCheck): Promise<boolean> {
    await this.fetchUserAndRoles();
    if (!this.roles) {
      return false;
    }
    const authService = container.resolve(AuthService);
    return authService.isCheckValid(_.flatten(
      this.roles.map(role =>
        role.permissions.map(permission => ({
          roleName: role.name,
          ...permission,
        }))
      )
    ), check);
  }

  private async fetchUserAndRoles(): Promise<void> {
    if (!this.payload || this._user || this._user === null) {
      return;
    }
    const db = container.resolve(DatabaseService);
    // findById() returns Promise<User | null> so it's just dandy here
    this._user = await db.users.findById(this.payload.userId);
    if (this._user) {
      this.roles = await db.roles.createQueryBuilder("role")
        .leftJoinAndSelect("role.permissions", "rolePermission")
        .whereInIds(this._user.roleIds)
        .getMany();
    }
  }
}
