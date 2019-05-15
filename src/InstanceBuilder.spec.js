const AppService = require("./app/service/AppService");
const WebService = require("./web/WebService");
const AppStore = require("./store/AppStore");
const TaskManager = require("./task/manager/TaskManager");

const { Instance, InstanceBuilder } = require("./Instance");

var appService, webService, appStore, taskManager, instance;

jest.mock("./app/service/AppService");
jest.mock("./web/WebService");
jest.mock("./store/AppStore");
jest.mock("./task/manager/TaskManager");

describe("InstanceBuilder", function() {
  beforeEach(function() {
    appService = new AppService();
    webService = new WebService();
    appStore = new AppStore();
    taskManager = new TaskManager();
    instance = new Instance()
      .withContext({})
      .withStore(appStore)
      .withTaskManager(taskManager)
      .withModuleLoaders([])
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

  test("it starts required services when start() called", () => {
    instance.start();
    expect(appService.start).toBeCalled();
    expect(webService.start).toBeCalled();
    expect(taskManager.start).toBeCalled();
  });

  test("it stops services when shutdown() called", () => {
    instance.start();
    instance.shutdown();
    expect(appService.shutdown).toBeCalled();
    expect(webService.shutdown).toBeCalled();
    expect(taskManager.shutdown).toBeCalled();
  });

  describe("InstanceBuilder", function() {
    test("builder allows us to set the Context", () => {
      new InstanceBuilder().withContext({});
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

    test("builder allows us to set the ModulesLoaders", () => {
      new InstanceBuilder().withModuleLoaders([]);
    });

    test("builder allows us to set the TaskManager", () => {
      new InstanceBuilder().withTaskManager(taskManager);
    });

    test("builder allows us to set the TaskWorkers", () => {
      new InstanceBuilder().withTaskWorkers([]);
    });

    test("builder returns a Instance instance when build method is called", () => {
      const instance = new InstanceBuilder()
        .withStore(store)
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
