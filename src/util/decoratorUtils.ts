/* eslint-disable @typescript-eslint/ban-types */

export const decoratorUtils = {
  /** push a value to a (potentially unset) array at a target/key */
  push: <T>(metadataKey: string, value: T, target: Object): void => {
    let values: T[] = [];
    if (Reflect.hasMetadata(metadataKey, target)) {
      values = Reflect.getMetadata(metadataKey, target) as T[];
    }
    values.push(value);
    Reflect.defineMetadata(metadataKey, values, target);
  },
  get: <T>(metadataKey: string, target: Object): T | undefined => Reflect.getMetadata(metadataKey, target) as T | undefined,
};
