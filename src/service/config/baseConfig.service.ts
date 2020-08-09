import * as dotenv from "dotenv";
import { singleton } from "tsyringe";
import { configUtils } from "../../util";

dotenv.config();

@singleton()
export class BaseConfigService {
  readonly environment = configUtils.optional("NODE_ENV") ?? "development";

  readonly httpPort = configUtils.required("HTTP_PORT", Number);

  readonly jwtKey = configUtils.required("JWT_KEY");

  get inDevelopment(): boolean {
    return this.environment === "development";
  }
}
