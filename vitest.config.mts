import path from "node:path";
import { fileURLToPath } from "node:url";
import swcPlugin from "unplugin-swc";
import { ViteUserConfig, mergeConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export const athenaViteConfig = ({
  swc,
  ...config
}: ViteUserConfig & { swc?: boolean }): ViteUserConfig =>
  mergeConfig<ViteUserConfig, ViteUserConfig>(
    {
      plugins: swc ? [swcPlugin.vite()] : [],
      test: {
        mockReset: true,
        clearMocks: true,
        testTimeout: 1000,
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
