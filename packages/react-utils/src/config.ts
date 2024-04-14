export const attributePrefix = "CONFIG_";

/**
 * @returns config values from <body> attributes.
 */
export const getConfigFromAttributes = (
  env: Record<string, unknown>,
): Record<string, string | undefined> => {
  const attrNames = document.body.getAttributeNames();
  const attributeConfig = Object.fromEntries(
    attrNames
      .filter((name) => name.toLocaleUpperCase().startsWith(attributePrefix))
      .map((name) => [
        name.slice(attributePrefix.length).toLocaleUpperCase(),
        document.body.getAttribute(name) ?? "",
      ]),
  );
  const slicedEnvConfig = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("VITE_"))
      .map(([key, value]) => [
        key.slice("VITE_".length).toLocaleUpperCase(),
        value?.toString(),
      ]),
  );
  return {
    ...attributeConfig,
    ...Object.fromEntries(
      Object.entries(env).map(([key, value]) => [
        key.toLocaleUpperCase(),
        value?.toString(),
      ]),
    ),
    ...slicedEnvConfig,
  };
};

/**
 * Populates index.html with environment variables from .env.example
 */
export const addHtmlConfigAttributes = async (
  inputHtmlFile = "./dist/index.html",
  exampleEnvFile = "./.env.example",
  outputHtmlFile = "./dist/index.html",
) => {
  const fs = await import("node:fs/promises");

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
