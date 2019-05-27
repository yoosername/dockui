const TaskManager = require("../../manager/TaskManager");
const Task = require("../../Task");
const AppStore = require("../../../store/AppStore");
const App = require("../../../app/App");
const AppLoader = require("../../../app/loader/AppLoader");
const { Config } = require("../../../config/Config");

jest.mock("../../manager/TaskManager");
jest.mock("../../Task");
jest.mock("../../../store/AppStore");
jest.mock("../../../app/loader/AppLoader");

const AppStateWorker = require("./AppStateWorker");

describe("AppStateWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(AppStateWorker).not.toBe(undefined);
    expect(typeof AppStateWorker).toBe("function");
  });

  test("should register with the taskmanager when start is called", async () => {
    const taskManager = new TaskManager();
    const store = new AppStore();
    const appLoader = new AppLoader();
    const config = new Config();
    const worker = new AppStateWorker({
      taskManager,
      store,
      appLoader,
      config
    });
    expect(worker.isRunning()).toBe(false);
    try {
      await worker.start();
    } catch (e) {}
    expect(worker.isRunning()).toBe(true);
    expect(taskManager.process).toHaveBeenCalledTimes(2);
    await worker.shutdown();
    expect(worker.isRunning()).toBe(false);
  });

  test("should call store to modify state", async () => {
    const taskManager = new TaskManager();
    const store = new AppStore();
    const appLoader = new AppLoader();
    const fakeApp = new App();
    appLoader.load.mockResolvedValue(fakeApp);
    const config = new Config();
    const worker = new AppStateWorker({
      taskManager,
      store,
      appLoader,
      config
    });
    const testPayload = { app: fakeApp, state: App.states.ENABLED };
    const task = new Task();
    task.getPayload.mockReturnValue(testPayload);
    await worker.processTask(task, worker);
    expect(task.emit).toHaveBeenCalledTimes(1);
    expect(store.update).toHaveBeenCalledTimes(1);
  });
});
