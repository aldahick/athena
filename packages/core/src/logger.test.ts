import "reflect-metadata";
import {
  MockInstance,
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { BaseConfig } from "./config.js";
import { Logger } from "./logger.js";

describe("logger", () => {
  let logMock: MockInstance;
  beforeAll(() => {
    logMock = vi.spyOn(process.stdout, "write");
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should print debug messages when options.level is debug", () => {
    class Config extends BaseConfig {
      graphqlSchemaDirs = [];
      http = { port: -1 };
      log = {
        level: "debug",
      };
    }

    const logger = new Logger(new Config());
    expect(logger.isDebugEnabled()).toEqual(true);
  });

  it("should not print debug messages when options.level is info", () => {
    class Config extends BaseConfig {
      graphqlSchemaDirs = [];
      http = { port: -1 };
      log = {
        level: "info",
        pretty: true,
      };
    }

    const logger = new Logger(new Config());
    expect(logger.isDebugEnabled()).toEqual(false);
  });
});
