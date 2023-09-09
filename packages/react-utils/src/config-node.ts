import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";

import { attributePrefix } from "./config.js";

/**
 * Populates index.html with environment variables from .env.example
 */
export const addHtmlConfigAttributes = async (
  inputHtmlFile = "./dist/index.html",
  exampleEnvFile = "./.env.example",
  outputHtmlFile = "./dist/index.html",
) => {
  const indexHtml = await fs.readFile(inputHtmlFile, "utf8");
  const exampleEnv = await fs.readFile(exampleEnvFile, "utf8");
  const envNames = exampleEnv
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.split("=")[0]?.trim())
    .filter((name): name is string => !!name?.length && !name.startsWith("#"));
  const envAttributes = envNames
    .map((name) => `${attributePrefix}${name}="${process.env[name] ?? ""}"`)
    .join(" ");
  const bodyPattern = /<body([^>]+)>/;
  const outputHtml = indexHtml.replace(
    bodyPattern,
    `<body$1 ${envAttributes}>`,
  );
  await fs.writeFile(outputHtmlFile, outputHtml);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await addHtmlConfigAttributes();
}
