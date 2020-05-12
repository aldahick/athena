import * as dotenv from "dotenv";
import { singleton } from "tsyringe";
import { ConfigUtils } from "../../util";

dotenv.config();

@singleton()
export class BaseConfigService {
  readonly environment = ConfigUtils.optional("NODE_ENV") || "development";
  readonly httpPort = ConfigUtils.required("HTTP_PORT", Number);
  readonly jwtKey = ConfigUtils.required("JWT_KEY");

  get inDevelopment() {
    return this.environment === "development";
  }
}
