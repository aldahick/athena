export const chunk = <T>(items: T[], size: number): T[][] => {
  if (size <= 0 || size % 1 !== 0) {
    throw new Error("Cannot chunk into slices of invalid size: " + size);
  }
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export const compact = <T>(items: T[]): Exclude<T, null | undefined>[] =>
  items.filter(
    (i): i is Exclude<T, null | undefined> => i !== undefined && i !== null
  );

export const sortBy = <T extends object>(
  items: T[],
  comparator: keyof T | ((a: T) => string)
) => {
  if (typeof comparator === "function") {
    return items.sort((a, b) => comparator(a).localeCompare(comparator(b)));
  }
  return items.sort((a, b) =>
    (a[comparator] as string).localeCompare(b[comparator] as string)
  );
};
