import * as dotenv from "dotenv";
import { singleton } from "tsyringe";
import { ConfigUtils } from "../../util";

dotenv.config();

@singleton()
export class BaseConfigService {
  httpPort = ConfigUtils.required("HTTP_PORT", Number);
  jwtKey = ConfigUtils.required("JWT_KEY");
}