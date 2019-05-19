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

const AppLoadWorker = require("./AppLoadWorker");

describe("AppLoadWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(AppLoadWorker).not.toBe(undefined);
    expect(typeof AppLoadWorker).toBe("function");
  });

  test("should register with the taskmanager when start is called", async () => {
    const manager = new TaskManager();
    const store = new AppStore();
    const loader = new AppLoader();
    const config = new Config();
    const worker = new AppLoadWorker(manager, store, loader, config);
    expect(worker.isRunning()).toBe(false);
    await worker.start();
    expect(worker.isRunning()).toBe(true);
    expect(manager.process).toHaveBeenCalledTimes(1);
    await worker.shutdown();
    expect(worker.isRunning()).toBe(false);
  });

  test("should call appLoader and store", async () => {
    const manager = new TaskManager();
    const store = new AppStore();
    const loader = new AppLoader();
    const fakeApp = new App();
    loader.load.mockResolvedValue(fakeApp);
    const config = new Config();
    const worker = new AppLoadWorker(manager, store, loader, config);
    const testPayload = { url: "testURL" };
    const task = new Task();
    task.getPayload.mockReturnValue(testPayload);
    await worker.processTask(task);
    expect(task.emit).toHaveBeenCalledTimes(1);
    expect(loader.load).toHaveBeenCalledTimes(1);
    expect(store.create).toHaveBeenCalledTimes(1);
  });
});