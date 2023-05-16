import { promises as fs } from "fs";
import { resolve } from "path";

import { chunk } from "./array-utils.js";

export const recursiveReaddir = async (
  path: string,
  chunkSize = 100
): Promise<string[]> => {
  const rootChildren = await fs.readdir(path);
  let allChildren: string[] = [];
  for (const rootChildrenChunk of chunk(rootChildren, chunkSize)) {
    const resolvedChildren = await Promise.all(
      rootChildrenChunk.map(async (childFile) => {
        const childPath = resolve(path, childFile);
        const stats = await fs.stat(childPath);
        return stats.isDirectory() ? recursiveReaddir(childPath) : [childPath];
      })
    );
    allChildren = allChildren.concat(resolvedChildren.flat());
  }
  return allChildren;
};
