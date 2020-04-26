import { container } from "tsyringe";
import { LoggerService } from "../service/logger";

export class ConfigUtils {
  static required<T = string>(key: string, valueTransformer?: (value: string) => T): T {
    const value = ConfigUtils.optional(key, valueTransformer);
    if (value === undefined) {
      // optional() logs already
      process.exit(1);
    }
    return value;
  };

  static optional<T = string>(key: string, valueTransformer?: (value: string) => T): T | undefined {
    const rawValue = process.env[key];
    if (rawValue === undefined) {
      const logger = container.resolve(LoggerService);
      logger.error({ key }, "config.missingVariable");
      return undefined;
    }
    return valueTransformer
      ? valueTransformer(rawValue)
      // string doesn't *technically* overlap with T but in practice, it will
      : rawValue as any as T;
  };
}

