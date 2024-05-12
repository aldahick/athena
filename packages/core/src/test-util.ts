import "reflect-metadata";
import { FormattedExecutionResult } from "graphql";
import { resolveConfig } from "./config.js";

export const fetchTestGraphql = async (query: string) => {
  const config = resolveConfig();
  const baseUrl = `http://localhost:${config.http.port}/`;
  const res: FormattedExecutionResult = await fetch(`${baseUrl}graphql`, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
  return [res, baseUrl] as const;
};
