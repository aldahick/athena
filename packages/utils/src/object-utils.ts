/**
 * Use sparingly! This is not type-safe, but is useful for assigning GraphQL resolvers. For now.
 */
export const assignDeep = (
  target: object,
  key: string,
  value: unknown,
): void => {
  let current = target;
  // not. type. safe.
  const keyParts = key.split(".") as never[];
  for (const [index, keyPart] of keyParts.entries()) {
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
  }
};
