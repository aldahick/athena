/**
 * Use sparingly! This is not type-safe, but is useful for assigning GraphQL resolvers. For now.
 */
export const assign = (target: object, key: string, value: unknown): void => {
  let current = target;
  // not. type. safe.
  const keyParts = key.split(".") as never[];
  keyParts.forEach((keyPart, index) => {
    if (index === keyParts.length - 1) {
      current[keyPart] = value as never;
    } else if (
      !(
        keyPart in current &&
        typeof current[keyPart] === "object" &&
        !!current[keyPart]
      )
    ) {
      current[keyPart] = {} as never;
    }
    current = current[keyPart];
  });
};

export const omit = <T extends object, K extends keyof T>(
  target: T,
  ...keys: K[]
): Omit<T, K> =>
  Object.fromEntries(
    Object.entries(target).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
