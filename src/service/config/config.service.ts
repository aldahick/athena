import * as dotenv from "dotenv";
import { singleton } from "tsyringe";
import { ConfigUtils } from "../../util";

dotenv.config();

@singleton()
export class ConfigService {
  httpPort = ConfigUtils.required("HTTP_PORT", Number);
}
