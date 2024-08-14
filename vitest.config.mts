import path from "node:path";
import { fileURLToPath } from "node:url";
import swcPlugin from "unplugin-swc";
import { UserConfig, mergeConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export const athenaViteConfig = ({
  swc,
  ...config
}: UserConfig & { swc?: boolean }): UserConfig =>
  mergeConfig<UserConfig, UserConfig>(
    {
      plugins: swc ? [swcPlugin.vite()] : [],
      test: {
        coverage: {
          enabled: true,
          include: ["src"],
          reporter: ["html", "text-summary", "lcov"],
          ignoreEmptyLines: false,
          extension: [".ts"],
          thresholds: {
            "100": true,
          },
        },
      },
    },
    config,
  );
