import { dirname } from "path";
import { fileURLToPath } from "url";

export const getModuleDir = (importMeta: ImportMeta): string =>
  dirname(fileURLToPath(importMeta.url));
