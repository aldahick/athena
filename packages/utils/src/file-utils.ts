import { promises as fs } from "fs";
import { resolve } from "path";

export const recursiveReaddir = async (path: string): Promise<string[]> => {
  const rootChildren = await fs.readdir(path);
  const resolvedChildren = await Promise.all(
    rootChildren.map(async (childFile) => {
      const childPath = resolve(path, childFile);
      const stats = await fs.stat(childPath);
      return stats.isDirectory() ? recursiveReaddir(childPath) : [childPath];
    })
  );
  return resolvedChildren.flat();
};
