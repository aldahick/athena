import { BaseConfigService, ConfigUtils,singleton } from "../../..";

@singleton()
export class ConfigService extends BaseConfigService {
  mongoUrl = ConfigUtils.required("MONGO_URL");
  postgresUrl = ConfigUtils.required("POSTGRES_URL");
}
