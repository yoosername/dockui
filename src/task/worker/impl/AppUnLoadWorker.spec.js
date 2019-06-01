const TaskManager = require("../../manager/TaskManager");
const Task = require("../../Task");
const AppStore = require("../../../store/AppStore");
const App = require("../../../app/App");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

jest.mock("../../manager/TaskManager");
jest.mock("../../Task");
jest.mock("../../../app/App");
jest.mock("../../../store/AppStore");

const AppUnLoadWorker = require("./AppUnLoadWorker");

describe("AppUnLoadWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(AppUnLoadWorker).not.toBe(undefined);
    expect(typeof AppUnLoadWorker).toBe("function");
  });

  test("should register with the taskmanager when start is called", async () => {
    const taskManager = new TaskManager();
    const store = new AppStore();
    const worker = new AppUnLoadWorker({
      taskManager,
      store
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

  test("should call store", async () => {
    const taskManager = new TaskManager();
    const store = new AppStore();
    const fakeApp = new App();
    fakeApp.getModules = jest.fn().mockReturnValue([]);
    const config = new Config();
    const worker = new AppUnLoadWorker({
      taskManager,
      store,
      config
    });
    const testPayload = { app: fakeApp };
    const task = new Task();
    task.getPayload.mockReturnValue(testPayload);
    await worker.processTask(task, worker);
    expect(task.emit).toHaveBeenCalledTimes(1);
    expect(store.delete).toHaveBeenCalledTimes(1);
  });
});
