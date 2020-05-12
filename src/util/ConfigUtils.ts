import { container } from "tsyringe";
import { LoggerService } from "../service/logger";

export class ConfigUtils {
  // to avoid duplicate notifications of missing keys
  private static checkedKeys: string[] = [];

  static required<T = string>(key: string, valueTransformer?: (value: string) => T): T {
    const value = ConfigUtils.optional(key, valueTransformer);
    if (value === undefined) {
      const logger = container.resolve(LoggerService);
      logger.error({ key }, "config.missingRequiredVariable");
      process.exit(1);
    }
    return value;
  };

  static optional<T = string>(key: string, valueTransformer?: (value: string) => T): T | undefined {
    const rawValue = process.env[key];
    if (rawValue === undefined) {
      if (!this.checkedKeys.includes(key)) {
        const logger = container.resolve(LoggerService);
        logger.warn({ key }, "config.missingVariable");
        this.checkedKeys.push(key);
      }
      return undefined;
    }
    return valueTransformer
      ? valueTransformer(rawValue)
      // string doesn't *technically* overlap with T but in practice, it will
      : rawValue as any as T;
  };
}

