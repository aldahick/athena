import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema/*.gql",
  config: {
    maybeValue: "T | undefined",
    typesPrefix: "I",
  },
  hooks: {
    afterAllFileWrite: "biome check --write --unsafe",
  },
  generates: {
    "src/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    "src/graphql-sdk.ts": {
      documents: "src/**/*.sdk.gql",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        noExport: true,
        gqlImport: "graphql-request#gql",
      },
    },
  },
};
export default config;
