const AppStore = require("../../store/AppStore");
const TaskManager = require("../../task/manager/TaskManager");
const AppService = require("./AppService");

jest.mock("../../store/AppStore");
jest.mock("../../task/manager/TaskManager");

var store = null;
var taskManager = null;

describe("AppService", function() {
  "use strict";

  beforeEach(function() {
    store = new AppStore();
    taskManager = new TaskManager();
  });

  test("should be defined and loadable", function() {
    expect(AppService).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof AppService).toBe("function");
  });

  test("should have correct signature", function() {
    const appService = new AppService(store, taskManager);
    expect(typeof appService.start).toBe("function");
    expect(typeof appService.shutdown).toBe("function");
    expect(typeof appService.loadApp).toBe("function");
    expect(typeof appService.unLoadApp).toBe("function");
    expect(typeof appService.enableApp).toBe("function");
    expect(typeof appService.disableApp).toBe("function");
    expect(typeof appService.getApps).toBe("function");
    expect(typeof appService.getApp).toBe("function");
    expect(typeof appService.loadModule).toBe("function");
    expect(typeof appService.unLoadModule).toBe("function");
    expect(typeof appService.getModules).toBe("function");
    expect(typeof appService.getModule).toBe("function");
    expect(typeof appService.enableModule).toBe("function");
    expect(typeof appService.disableModule).toBe("function");
  });

  test("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = jest.spyOn(console, "warn").mockImplementation();
    const appService = new AppService();
    appService.start();
    appService.shutdown();
    appService.loadApp();
    appService.unLoadApp();
    appService.enableApp();
    appService.disableApp();
    appService.getApps();
    appService.getApp();
    appService.loadModule();
    appService.unLoadModule();
    appService.getModules();
    appService.getModule();
    appService.enableModule();
    appService.disableModule();
    expect(logSpy).toHaveBeenCalledTimes(14);
    logSpy.mockRestore();
  });

  test("should extend event Emmitter", function(done) {
    const appService = new AppService(store, taskManager);
    const PAYLOAD = { test: "payload" };
    appService.on("test", payload => {
      expect(payload).toBe(PAYLOAD);
      done();
    });
    appService.emit("test", PAYLOAD);
  });
});
