const AppService = require("./app/service/AppService");
const WebService = require("./web/WebService");
const AppStore = require("./store/AppStore");
const TaskManager = require("./task/manager/TaskManager");
const { Config } = require("./config/Config");

const { Instance, InstanceBuilder } = require("./Instance");

var appService, webService, appStore, taskManager, instance;

jest.mock("./app/service/AppService");
jest.mock("./web/WebService");
jest.mock("./store/AppStore");
jest.mock("./task/manager/TaskManager");
jest.mock("./config/Config");

describe("Instance", function() {
  beforeEach(function() {
    config = new Config();
    appService = new AppService();
    appService.start = jest.fn().mockImplementation(() => Promise.resolve());
    appService.shutdown = jest.fn().mockImplementation(() => Promise.resolve());
    webService = new WebService();
    webService.start = jest.fn().mockImplementation(() => Promise.resolve());
    webService.shutdown = jest.fn().mockImplementation(() => Promise.resolve());
    appStore = new AppStore();
    taskManager = new TaskManager();
    taskManager.start = jest.fn().mockImplementation(() => Promise.resolve());
    taskManager.shutdown = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    instance = new Instance()
      .withConfig(config)
      .withStore(appStore)
      .withTaskManager(taskManager)
      .withTaskWorkers([])
      .withReactors([])
      .withAppService(appService)
      .withWebService(webService)
      .build();
  });

  test("it is defined and loadable", () => {
    expect(Instance).toBeDefined();
    expect(InstanceBuilder).toBeDefined();
    expect(typeof Instance).toBe("function");
    expect(typeof InstanceBuilder).toBe("function");
  });

  test("it returns a Instance.Builder if one isnt passed as arg", () => {
    var builder = new Instance();
    expect(builder).toBeInstanceOf(InstanceBuilder);
  });

  test("it starts required services when start() called", async () => {
    await instance.start();
    expect(appService.start).toHaveBeenCalled();
    expect(taskManager.start).toHaveBeenCalled();
    expect(webService.start).toHaveBeenCalled();
  });

  test("it stops services when shutdown() called", async () => {
    await instance.start();
    await instance.shutdown();
    expect(appService.shutdown).toHaveBeenCalled();
    expect(webService.shutdown).toHaveBeenCalled();
    expect(taskManager.shutdown).toHaveBeenCalled();
  });

  describe("InstanceBuilder", function() {
    test("builder allows us to set the Context", () => {
      new InstanceBuilder().withConfig({});
    });

    test("builder allows us to set the WebService", () => {
      new InstanceBuilder().withWebService(webService);
    });

    test("builder allows us to set the AppService", () => {
      new InstanceBuilder().withAppService(appService);
    });

    test("builder allows us to set the Store", () => {
      new InstanceBuilder().withStore(appStore);
    });

    test("builder allows us to set the Reactors", () => {
      new InstanceBuilder().withReactors([]);
    });

    test("builder allows us to set the TaskManager", () => {
      new InstanceBuilder().withTaskManager(taskManager);
    });

    test("builder allows us to set the TaskWorkers", () => {
      new InstanceBuilder().withTaskWorkers([]);
    });

    test("builder returns a Instance instance when build method is called", () => {
      const instance = new InstanceBuilder()
        .withStore(appStore)
        .withTaskManager(taskManager)
        .withTaskWorkers([])
        .withReactors([])
        .withAppService(appService)
        .withWebService(webService)
        .build();
      expect(instance).toBeInstanceOf(Instance);
    });
  });
});
