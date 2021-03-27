import * as dotenv from "dotenv";
import { singleton } from "tsyringe";

import { configUtils } from "../../util";

dotenv.config();

@singleton()
export class BaseConfigService {
  readonly environment = configUtils.optional("NODE_ENV") ?? "development";

  readonly httpPort = configUtils.optional("HTTP_PORT", Number);

  readonly jwtKey = configUtils.optional("JWT_KEY");

  readonly uploadLimit = configUtils.optional("UPLOAD_LIMIT");

  get inDevelopment(): boolean {
    return this.environment === "development";
  }
}
