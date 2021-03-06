const TaskManager = require("../../manager/TaskManager");
const Task = require("../../Task");
const AppStore = require("../../../store/AppStore");
const App = require("../../../app/App");
const { Config } = require("../../../config/Config");

jest.mock("../../manager/TaskManager");
jest.mock("../../Task");
jest.mock("../../../app/App");
jest.mock("../../../store/AppStore");

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
    const config = new Config();
    const worker = new AppStateWorker({
      taskManager,
      store,
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
    const fakeApp = new App();
    store.read.mockReturnValue(fakeApp);
    fakeApp.getId.mockReturnValue(1);
    fakeApp.toJSON.mockReturnValue({ id: 1, enabled: false });
    const config = new Config();
    const worker = new AppStateWorker({
      taskManager,
      store,
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
