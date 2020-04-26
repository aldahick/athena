export class DecoratorUtils {
  /** push a value to a (potentially unset) array at a target/key */
  static push<T>(metadataKey: string, value: T, target: any): void {
    let values: T[] = [];
    if (Reflect.hasMetadata(metadataKey, target)) {
      values = Reflect.getMetadata(metadataKey, target);
    }
    values.push(value);
    Reflect.defineMetadata(metadataKey, values, target);
  }

  /** mostly a typed wrapper around Reflect.getMetadata */
  static get<T>(metadataKey: string, target: any): T | undefined {
    return Reflect.getMetadata(metadataKey, target);
  }
}
