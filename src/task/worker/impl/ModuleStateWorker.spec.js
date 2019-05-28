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

const ModuleStateWorker = require("./ModuleStateWorker");

describe("ModuleStateWorker", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(ModuleStateWorker).not.toBe(undefined);
    expect(typeof ModuleStateWorker).toBe("function");
  });

  test("should register with the taskmanager when start is called", async () => {
    const taskManager = new TaskManager();
    const store = new AppStore();
    const appLoader = new AppLoader();
    const config = new Config();
    const worker = new ModuleStateWorker({
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
});
