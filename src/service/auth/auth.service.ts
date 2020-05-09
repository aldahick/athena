import { AccessControl } from "accesscontrol";
import * as jwt from "jsonwebtoken";
import * as _ from "lodash";
import { singleton } from "tsyringe";
import { BaseConfigService } from "../config";
import { AuthCheck } from "../../registry/auth";

/**
 * Various utilities related to tokens & permissions
 */
@singleton()
export class AuthService {
  constructor(
    private config: BaseConfigService
  ) { }

  verifyToken(token: string): object {
    return jwt.verify(token, this.config.jwtKey) as object;
  }

  signToken(payload: object): string {
    return jwt.sign(payload, this.config.jwtKey);
  }

  // this one's interesting
  /** requires that all checks pass, not just one */
  isCheckValid(permissions: {
    roleName: string;
    resource: string;
    action: string;
    attributes?: string;
  }[], checkOrChecks: AuthCheck): boolean {
    // convert the flat permissions into appropriate structure for accesscontrol
    const ac = new AccessControl(permissions.map(permission => ({
      attributes: "*",
      role: permission.roleName,
      ...permission,
    })));
    // get role names
    const roles = _.uniq(permissions.map(p => p.roleName));
    // coerce checkOrChecks into, well, an array
    const checks = checkOrChecks instanceof Array ? checkOrChecks : [checkOrChecks];
    for (const check of checks) {
    // big ugly check: at least one role complies with `check`
      const isAuthorized = roles.some(r => {
      // can this role do `action` to `resource`?
        const permission = ac.can(r)[check.action](check.resource);
        // is the found perm * or is the specified attribute included?
        const isAttributeAllowed = permission.attributes.includes("*") || (
          check.attributes && permission.attributes.includes(check.attributes)
        );
        if (permission.granted && isAttributeAllowed) {
          return true;
        }
      });
      // if no roles comply with `check`, not authorized
      if (!isAuthorized) {
        return false;
      }
    }
    return true;
  };
}
