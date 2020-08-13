import { BaseConfigService, configUtils, singleton } from "../../..";

@singleton()
export class ConfigService extends BaseConfigService {
  mongoUrl = configUtils.required("MONGO_URL");

  postgresUrl = configUtils.required("POSTGRES_URL");

  redisUrl = configUtils.required("REDIS_URL");
}
