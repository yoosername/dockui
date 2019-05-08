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

  test("should throw if not instantiated with single context object", function() {
    var undefined;

    expect(() => {
      new AppService(null);
    }).toThrow();
    expect(() => {
      new AppService(null, null, null);
    }).toThrow();
    expect(() => {
      new AppService();
    }).toThrow();
    expect(() => {
      new AppService("string");
    }).toThrow();
    expect(() => {
      new AppService(undefined);
    }).toThrow();
    expect(() => {
      new AppService([]);
    }).toThrow();
    expect(() => {
      new AppService({});
    }).not.toThrow();
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
