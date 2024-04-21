import { fileURLToPath } from "node:url";
import { addHtmlConfigAttributes } from "./config.js";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await addHtmlConfigAttributes(...process.argv.slice(2));
}
