import { fileURLToPath } from "node:url";
import { addHtmlConfigAttributes } from "./config.js";

const mainFile = process.argv[1]?.replace(/\.ts$/, ".js");
const thisFile = fileURLToPath(import.meta.url).replace(/\.ts$/, ".js");
if (mainFile === thisFile) {
  await addHtmlConfigAttributes(...process.argv.slice(2));
}
