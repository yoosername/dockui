const AppServiceFactory = require("./AppServiceFactory");
const AppService = require("../AppService");

describe("AppServiceFactory", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(AppServiceFactory).not.toBeUndefined();
    expect(typeof AppServiceFactory).toBe("object");
    expect(typeof AppServiceFactory.create).toBe("function");
  });

  test("should return a valid TaskManager instance with or without config", function() {
    const appService = AppServiceFactory.create();
    expect(appService).not.toBeUndefined();
    expect(typeof appService).toBe("object");
    expect(appService instanceof AppService).toBe(true);
  });
});
