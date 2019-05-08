const AppStore = require("../../../store/AppStore");
const TaskManager = require("../../../task/manager/TaskManager");
var DefaultAppService = require("./DefaultAppService");

jest.mock("../../../store/AppStore");
jest.mock("../../../task/manager/TaskManager");

var store = null;
var taskManager = null;

describe("DefaultAppService", function() {
  "use strict";

  beforeEach(function() {
    store = new AppStore();
    taskManager = new TaskManager();
  });

  test("should be defined and loadable", function() {
    expect(DefaultAppService).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof DefaultAppService).toBe("function");
  });

  test("should throw if not instantiated with single context object", function() {
    var undefined;

    expect(() => {
      new DefaultAppService(null);
    }).toThrow();
    expect(() => {
      new DefaultAppService(null, null, null);
    }).toThrow();
    expect(() => {
      new DefaultAppService();
    }).toThrow();
    expect(() => {
      new DefaultAppService("string");
    }).toThrow();
    expect(() => {
      new DefaultAppService(undefined);
    }).toThrow();
    expect(() => {
      new DefaultAppService([]);
    }).toThrow();
    expect(() => {
      new DefaultAppService({});
    }).not.toThrow();
  });

  test("should have correct signature", function() {
    const appService = new DefaultAppService(store, taskManager);
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

  // TODO: Test that it actually makes correct Store and TaskManager calls.
});
