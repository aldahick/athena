import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const getModuleDir = (importMeta: ImportMeta): string =>
  dirname(fileURLToPath(importMeta.url));

export const isModuleMain = (importMeta: ImportMeta): boolean =>
  importMeta.url === pathToFileURL(process.argv[1] ?? "").href;
