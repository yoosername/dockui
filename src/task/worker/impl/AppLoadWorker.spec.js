const TaskManager = require("../../manager/TaskManager");
const Task = require("../../Task");
const AppStore = require("../../../store/AppStore");
const App = require("../../../app/App");
const AppLoader = require("../../../app/loader/AppLoader");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

jest.mock("../../manager/TaskManager");
jest.mock("../../Task");
jest.mock("../../../app/App");
jest.mock("../../../store/AppStore");
jest.mock("../../../app/loader/AppLoader");

const AppLoadWorker = require("./AppLoadWorker");

describe("AppLoadWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(AppLoadWorker).not.toBe(undefined);
    expect(typeof AppLoadWorker).toBe("function");
  });

  test("should register with the taskmanager when start is called", async () => {
    const taskManager = new TaskManager();
    const store = new AppStore();
    const appLoader = new AppLoader();
    const worker = new AppLoadWorker({
      taskManager,
      store,
      appLoader
    });
    expect(worker.isRunning()).toBe(false);
    try {
      await worker.start();
    } catch (e) {}
    expect(worker.isRunning()).toBe(true);
    expect(taskManager.process).toHaveBeenCalledTimes(1);
    await worker.shutdown();
    expect(worker.isRunning()).toBe(false);
  });

  test("should call appLoader and store", async () => {
    const taskManager = new TaskManager();
    const store = new AppStore();
    const appLoader = new AppLoader();
    const fakeApp = new App();
    const fakeAppModules = [{ key: "module1" }, { key: "module2" }];
    fakeApp.toJSON.mockReturnValue({
      id: "testApp",
      modules: fakeAppModules
    });
    fakeApp.getModules.mockReturnValue(fakeAppModules);
    appLoader.load.mockResolvedValue(fakeApp);
    const config = new Config();
    const worker = new AppLoadWorker({ taskManager, store, appLoader, config });
    const testPayload = { url: "testURL", permission: "read" };
    const task = new Task();
    task.getPayload.mockReturnValue(testPayload);
    await worker.processTask(task, worker);
    expect(task.emit).toHaveBeenCalledTimes(1);
    expect(appLoader.load).toHaveBeenCalledTimes(1);
    // Store should have been called once for app and once for each module totalling three times
    expect(store.create).toHaveBeenCalledTimes(3);
  });
});
