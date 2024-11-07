import { athenaViteConfig } from "../../vitest.config.mjs";

export default athenaViteConfig({
  swc: true,
  test: {
    setupFiles: ["./src/test-setup.ts"],
  },
});
