const WebService = require("./WebService");

describe("WebService", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and a loadable function", function() {
    expect(WebService).not.toBeUndefined();
    expect(typeof WebService).toBe("function");
  });

  it("should have correct signature", function() {
    const webService = new WebService();
    expect(typeof webService.setupMiddleware).toBe("function");
    expect(typeof webService.start).toBe("function");
    expect(typeof webService.shutdown).toBe("function");
    expect(typeof webService.isRunning).toBe("function");
    expect(typeof webService.getAppService).toBe("function");
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = jest.spyOn(console, "warn").mockImplementation();
    const webService = new WebService();
    webService.setupMiddleware();
    webService.start();
    webService.shutdown();
    webService.isRunning();
    webService.getAppService();
    expect(logSpy).toHaveBeenCalledTimes(5);
    logSpy.mockRestore();
  });
});
