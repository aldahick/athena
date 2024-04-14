import { fileURLToPath } from "node:url";
import { addHtmlConfigAttributes } from "./config.js";

console.log("test", process.argv);
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await addHtmlConfigAttributes(...process.argv.slice(2));
}
