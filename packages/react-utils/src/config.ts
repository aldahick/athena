const attributePrefix = "CONFIG_";

/**
 * @returns config values from <body> attributes.
 */
export const getConfigFromAttributes = () => {
  const attrNames = document.body.getAttributeNames();
  return Object.fromEntries(
    attrNames
      .filter((name) => name.startsWith(attributePrefix))
      .map((name) => [
        name.slice(attributePrefix.length),
        document.body.getAttribute(name) ?? "",
      ]),
  );
};

/**
 * Populates index.html with environment variables from .env.example
 */
export const addHtmlConfigAttributes = async (
  inputHtmlFile = "./index.html",
  exampleEnvFile = "./.env.example",
  outputHtmlFile = "./index.html",
) => {
  // Imported internally so that this file can still be imported from React
  const fs = await import("fs/promises");
  const indexHtml = await fs.readFile(inputHtmlFile, "utf8");
  const exampleEnv = await fs.readFile(exampleEnvFile, "utf8");
  const envNames = exampleEnv
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.split("=")[0]?.trim())
    .filter((name): name is string => !!name?.length && !name.startsWith("#"));
  const envAttributes = envNames
    .map((name) => `${attributePrefix}${name}="${process.env[name]}"`)
    .join(" ");
  const bodyPattern = /<body([^>]+)>/;
  const outputHtml = indexHtml.replace(
    bodyPattern,
    `<body$1 ${envAttributes}>`,
  );
  await fs.writeFile(outputHtmlFile, outputHtml);
};

if (
  process &&
  process.argv[1] === (await import("url")).fileURLToPath(import.meta.url)
) {
  await addHtmlConfigAttributes();
}
