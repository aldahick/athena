import { container } from "tsyringe";
import { LoggerService } from "../service/logger";

const ERROR_EXIT_CODE = 1;

class ConfigUtils {
  // to avoid duplicate notifications of missing keys
  private readonly checkedKeys: string[] = [];

  required<T = string>(key: string, valueTransformer?: (value: string) => T): T {
    const value = this.optional(key, valueTransformer);
    if (value === undefined) {
      const logger = container.resolve(LoggerService);
      logger.error({ key }, "config.missingRequiredVariable");
      process.exit(ERROR_EXIT_CODE);
    }
    return value;
  }

  optional<T = string>(key: string, valueTransformer?: (value: string) => T): T | undefined {
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
      : rawValue as unknown as T;
  }
}

export const configUtils = new ConfigUtils();
