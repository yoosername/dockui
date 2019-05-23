const LoggerFactory = require("./LoggerFactory");
const Logger = require("../Logger");

describe("LoggerFactory", function() {
  "use strict";

  test("create should return an instance of Logger", function() {
    const logger = LoggerFactory.create();
    expect(logger).not.toBeUndefined();
    expect(typeof logger).toBe("object");
    expect(logger instanceof Logger).toBe(true);
  });
});
