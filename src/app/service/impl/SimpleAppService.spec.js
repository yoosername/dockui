const AppStore = require("../../../store/AppStore");
const App = require("../../App");
const TaskManager = require("../../../task/manager/TaskManager");
const Task = require("../../../task/Task");
const SimpleAppService = require("./SimpleAppService");
const AppService = require("../AppService");
const Store = require("../../../store/AppStore");

jest.mock("../../../store/AppStore");
jest.mock("../../../task/manager/TaskManager");
jest.mock("../../../task/Task");
jest.mock("../../App");

var store = null;
var taskManager = null;
var task = null;

describe("SimpleAppService", () => {
  "use strict";

  beforeEach(() => {
    store = new AppStore();
    taskManager = new TaskManager();
    task = new Task();
    taskManager.create.mockResolvedValue(task);
  });

  test("should be defined and loadable", async () => {
    expect(SimpleAppService).not.toBeUndefined();
  });

  test("should be a function", async () => {
    const appService = new SimpleAppService(taskManager, store);
    expect(typeof SimpleAppService).toBe("function");
    expect(appService instanceof AppService).toBe(true);
  });

  test("should have correct signature", async () => {
    const appService = new SimpleAppService(taskManager, store);
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

  test("start should return promise that resolves when appService is ready", async () => {
    const appService = new SimpleAppService(taskManager, store);
    expect(appService.isRunning()).toEqual(false);
    await appService.start();
    expect(appService.isRunning()).toEqual(true);
  });

  test("start should also start the taskManager if it isnt already", async () => {
    const appService = new SimpleAppService(taskManager, store);
    expect(taskManager.start).not.toHaveBeenCalled();
    await appService.start();
    expect(taskManager.start).toHaveBeenCalled();
  });

  test("shutdown should return promise that resolves when appService has stopped", async () => {
    const appService = new SimpleAppService(taskManager, store);
    expect(appService.isRunning()).toEqual(false);
    await appService.start();
    expect(appService.isRunning()).toEqual(true);
    await appService.shutdown();
    expect(appService.isRunning()).toEqual(false);
  });

  test("should load an app by delegating to taskManager", () => {
    // Test that appService calls TaskManager.create("APP_LOAD"
    const appService = new SimpleAppService(taskManager, store);
    const urlParam = "http://fake.url/descriptor.yml";
    const permissionParam = App.permissions.READ;
    appService.loadApp(urlParam, permissionParam);
    expect(taskManager.create).toHaveBeenCalledWith(Task.types.APP_LOAD, {
      permission: permissionParam,
      url: urlParam
    });
  });

  test("should unload an app by delegating to taskManager", async () => {
    // Test that appService calls TaskManager.create("APP_LOAD"
    const appService = new SimpleAppService(taskManager, store);
    const app = new App();
    appService.unLoadApp(app);
    expect(taskManager.create).toHaveBeenCalledWith(Task.types.APP_UNLOAD, app);
  });

  test("should enable an app by delegating to taskManager", async () => {
    // Test that appService calls TaskManager.create("APP_LOAD"
    const appService = new SimpleAppService(taskManager, store);
    const app = new App();
    // Create Task if App isnt already enabled.
    appService.enableApp(app);
    expect(taskManager.create).toHaveBeenCalledWith(Task.types.APP_ENABLE, app);
    expect(taskManager.create).toHaveBeenCalledTimes(1);
    // Dont create Task if App is already enabled.
    app.isEnabled.mockImplementation(() => {
      return true;
    });
    appService.enableApp(app);
    expect(taskManager.create).toHaveBeenCalledTimes(1);
  });

  test("should disable an app by delegating to taskManager", async () => {
    // Test that appService calls TaskManager.create("APP_LOAD"
    const appService = new SimpleAppService(taskManager, store);
    const app = new App();
    expect(taskManager.create).toHaveBeenCalledTimes(0);
    // Dont Create Task if App is already disabled.
    appService.disableApp(app);
    expect(taskManager.create).toHaveBeenCalledTimes(0);
    // Create Task if App is enabled.
    app.isEnabled.mockImplementation(() => {
      return true;
    });
    appService.disableApp(app);
    expect(taskManager.create).toHaveBeenCalledTimes(1);
    expect(taskManager.create).toHaveBeenCalledWith(
      Task.types.APP_DISABLE,
      app
    );
  });

  test("should get all known apps from the store (with optional filter)", async () => {
    // Test that appService calls store.read(
    const store = new Store();
    const testApps = [new App(), new App()];
    store.find.mockResolvedValue(testApps);
    const appService = new SimpleAppService(taskManager, store);
    const apps = await appService.getApps("fakenews");
    expect(store.find).toHaveBeenCalledWith("fakenews");
    expect(apps.length).toEqual(2);
    expect(apps).toEqual(testApps);
  });

  test("should get a single app from the store", async () => {});
  test("should get all known modules from the store (with optional filter)", async () => {});
  test("should get a single module from the store", async () => {});
  test("should enable a module by delegating to taskManager", async () => {});
  test("should disable a module by delegating to taskManager", async () => {});
});
