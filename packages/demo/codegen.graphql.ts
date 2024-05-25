import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema/*.gql",
  config: {
    maybeValue: "T | undefined",
    typesPrefix: "I",
  },
  hooks: {
    afterAllFileWrite: "biome check --apply-unsafe",
  },
  generates: {
    "src/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
};
export default config;
