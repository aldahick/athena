import { describe, it } from "vitest";
import { createApp } from "./application.js";
import { resolveQuery, resolver } from "./index.js";
import { createTestConfig } from "./test-util.js";

describe("application", () => {
  it("should start and stop multiple times", async () => {
    @resolver()
    class HelloResolver {
      @resolveQuery()
      hello() {
        return "hello, world!";
      }
    }

    createTestConfig();
    const app = createApp();

    for (let i = 0; i < 5; i++) {
      try {
        await app.start();
      } finally {
        await app.stop();
      }
    }
  });
});
