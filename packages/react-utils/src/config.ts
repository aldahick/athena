export const attributePrefix = "CONFIG_";

/**
 * @returns config values from <body> attributes.
 */
export const getConfigFromAttributes = () => {
  const attrNames = document.body.getAttributeNames();
  const attributeConfig = Object.fromEntries(
    attrNames
      .filter((name) => name.toLocaleUpperCase().startsWith(attributePrefix))
      .map((name) => [
        name.slice(attributePrefix.length).toLocaleUpperCase(),
        document.body.getAttribute(name) ?? "",
      ]),
  );
  const envConfig =
    (import.meta as unknown as { env?: Record<string, string> }).env ?? {};
  const slicedEnvConfig = Object.fromEntries(
    Object.entries(envConfig)
      .filter(([key]) => key.startsWith("VITE_"))
      .map(([key, value]) => [key.slice("VITE_".length), value]),
  );
  return {
    ...attributeConfig,
    ...envConfig,
    ...slicedEnvConfig,
  };
};
