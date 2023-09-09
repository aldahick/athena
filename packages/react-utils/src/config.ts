export const attributePrefix = "CONFIG_";

/**
 * @returns config values from <body> attributes.
 */
export const getConfigFromAttributes = () => {
  const attrNames = document.body.getAttributeNames();
  const attributeConfig = Object.fromEntries(
    attrNames
      .filter((name) => name.startsWith(attributePrefix))
      .map((name) => [
        name.slice(attributePrefix.length).toLocaleUpperCase(),
        document.body.getAttribute(name) ?? "",
      ]),
  );
  return {
    ...attributeConfig,
    ...(import.meta as unknown as { env: Record<string, string> }).env,
  };
};
