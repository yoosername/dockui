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
jest.mock("../../../config/Config");

const AppStateWorker = require("./AppStateWorker");

describe("AppStateWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(AppStateWorker).not.toBe(undefined);
    expect(typeof AppStateWorker).toBe("function");
  });

  test("should register with the taskmanager when start is called", async () => {
    const manager = new TaskManager();
    const store = new AppStore();
    const loader = new AppLoader();
    const config = new Config();
    const worker = new AppStateWorker(manager, store, loader, config);
    expect(worker.isRunning()).toBe(false);
    await worker.start();
    expect(worker.isRunning()).toBe(true);
    expect(manager.process).toHaveBeenCalledTimes(2);
    await worker.shutdown();
    expect(worker.isRunning()).toBe(false);
  });

  test("should call store to modify state", async () => {
    const manager = new TaskManager();
    const store = new AppStore();
    const loader = new AppLoader();
    const fakeApp = new App();
    loader.load.mockResolvedValue(fakeApp);
    const config = new Config();
    const worker = new AppStateWorker(manager, store, loader, config);
    const testPayload = { app: fakeApp, state: App.states.ENABLED };
    const task = new Task();
    task.getPayload.mockReturnValue(testPayload);
    await worker.processTask(task);
    expect(task.emit).toHaveBeenCalledTimes(1);
    expect(store.update).toHaveBeenCalledTimes(1);
  });
});
