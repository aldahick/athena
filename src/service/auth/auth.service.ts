import { AccessControl } from "accesscontrol";
import * as jwt from "jsonwebtoken";
import * as _ from "lodash";
import { singleton } from "tsyringe";

import { AuthCheck } from "../../registry/auth";
import { BaseConfigService } from "../config";

/**
 * Various utilities related to tokens & permissions
 */
@singleton()
export class AuthService {
  constructor(
    private readonly baseConfig: BaseConfigService
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifyToken(token: string): {[key: string]: any} | undefined {
    let payload: string | {[key: string]: unknown};
    try {
      payload = jwt.verify(token, this.jwtKey) as string | {[key: string]: unknown};
    } catch (err) {
      return undefined;
    }
    if (typeof payload !== "object") {
      throw new Error("Token payload is not an object");
    }
    return payload;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signToken(payload: {[key: string]: any}): string {
    return jwt.sign(payload, this.jwtKey);
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
        const isAttributeAllowed = permission.attributes.includes("*") ||
          check.attributes !== undefined && permission.attributes.includes(check.attributes);
        return permission.granted && isAttributeAllowed;
      });
      // if no roles comply with `check`, not authorized
      if (!isAuthorized) {
        return false;
      }
    }
    return true;
  }

  private get jwtKey(): string {
    const { jwtKey } = this.baseConfig;
    if (jwtKey === undefined) {
      throw new Error("Missing required environment variable JWT_KEY");
    }
    return jwtKey;
  }
}
