const AppServiceFactory = require("./AppServiceFactory");

describe("AppServiceFactory", function() {
  "use strict";

  it("should be defined and a loadable function", function() {
    expect(AppServiceFactory).not.toBeUndefined();
    expect(typeof AppServiceFactory).toBe("object");
    expect(typeof AppServiceFactory.create).toBe("function");
  });

  it("should return a valid TaskManager instance with or without config", function() {
    const appService = AppServiceFactory.create();
    expect(typeof appService).toBe("function");
  });
});
