import "reflect-metadata";
import assert from "node:assert";
import { Mock, after, afterEach, before, describe, it, mock } from "node:test";
import { BaseConfig } from "./config.js";
import { Logger } from "./logger.js";

describe("logger", () => {
  let logMock: Mock<NodeJS.WriteStream["write"]>;
  before(() => {
    logMock = mock.method(process.stdout, "write");
    logMock.mock.mockImplementation(() => {});
  });
  afterEach(() => {
    logMock.mock.resetCalls();
  });
  after(() => {
    logMock.mock.restore();
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
    logger.debug("test");
    const firstCall = logMock.mock.calls[0];
    const expected = JSON.stringify({ level: "debug", message: "test" });
    assert.ok(firstCall);
    assert.deepStrictEqual(firstCall.arguments, [`${expected}\n`]);
  });

  it("should not print debug messages when options.level is info", () => {
    class Config extends BaseConfig {
      graphqlSchemaDirs = [];
      http = { port: -1 };
      log = {
        level: "info",
      };
    }

    const logger = new Logger(new Config());
    logger.debug("test");
    assert.strictEqual(logMock.mock.callCount(), 0);
  });

  it("should print JSON when options.pretty is false", () => {
    class Config extends BaseConfig {
      graphqlSchemaDirs = [];
      http = { port: -1 };
      log = {
        pretty: false,
      };
    }

    const logger = new Logger(new Config());
    logger.info("test");
    const firstCall = logMock.mock.calls[0];
    const expected = JSON.stringify({ level: "info", message: "test" });
    assert.ok(firstCall);
    assert.deepStrictEqual(firstCall.arguments, [`${expected}\n`]);
  });

  it("should print beautifully when options.pretty is true", () => {
    class Config extends BaseConfig {
      graphqlSchemaDirs = [];
      http = { port: -1 };
      log = {
        pretty: true,
      };
    }

    const logger = new Logger(new Config());
    logger.info("test");
    const firstCall = logMock.mock.calls[0];
    assert.ok(firstCall);
    assert.deepStrictEqual(firstCall.arguments, ["info: test\n"]);
  });
});
