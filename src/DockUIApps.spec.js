const AppService = require("./app/service/AppService");
const WebService = require("./web/WebService");
const AppStore = require("./store/AppStore");
const TaskManager = require("./task/manager/TaskManager");

const { DockUIApps, DockUIAppsBuilder } = require("./DockUIApps");

var appService, webService, appStore, taskManager, dockUIApps;

jest.mock("./app/service/AppService");
jest.mock("./web/WebService");
jest.mock("./store/AppStore");
jest.mock("./task/manager/TaskManager");

describe("DockUIApps", function() {
  beforeEach(function() {
    appService = new AppService();
    webService = new WebService();
    appStore = new AppStore();
    taskManager = new TaskManager();
    dockUIApps = new DockUIApps()
      .withContext({})
      .withStore(appStore)
      .withTaskManager(taskManager)
      .withModuleLoaders([])
      .withAppService(appService)
      .withWebService(webService)
      .build();
  });

  test("it is defined and loadable", () => {
    expect(DockUIApps).toBeDefined();
    expect(DockUIAppsBuilder).toBeDefined();
    expect(typeof DockUIApps).toBe("function");
    expect(typeof DockUIAppsBuilder).toBe("function");
  });

  test("it returns a DockUIApps.Builder if one isnt passed as arg", () => {
    var builder = new DockUIApps();
    expect(builder).toBeInstanceOf(DockUIAppsBuilder);
  });

  test("it starts required services when start() called", () => {
    dockUIApps.start();
    expect(appService.start).toBeCalled();
    expect(webService.start).toBeCalled();
    expect(taskManager.start).toBeCalled();
  });

  test("it stops services when shutdown() called", () => {
    dockUIApps.start();
    dockUIApps.shutdown();
    expect(appService.shutdown).toBeCalled();
    expect(webService.shutdown).toBeCalled();
    expect(taskManager.shutdown).toBeCalled();
  });

  describe("DockUIAppsBuilder", function() {
    test("builder allows us to set the Context", () => {
      new DockUIAppsBuilder().withContext({});
    });

    test("builder allows us to set the WebService", () => {
      new DockUIAppsBuilder().withWebService(webService);
    });

    test("builder allows us to set the AppService", () => {
      new DockUIAppsBuilder().withAppService(appService);
    });

    test("builder allows us to set the Store", () => {
      new DockUIAppsBuilder().withStore(appStore);
    });

    test("builder allows us to set the ModulesLoaders", () => {
      new DockUIAppsBuilder().withModuleLoaders([]);
    });

    test("builder allows us to set the TaskManager", () => {
      new DockUIAppsBuilder().withTaskManager(taskManager);
    });

    test("builder allows us to set the TaskWorkers", () => {
      new DockUIAppsBuilder().withTaskWorkers([]);
    });

    test("builder returns a DockUIApps instance when build method is called", () => {
      const dockuiAppsInstance = new DockUIAppsBuilder()
        .withContext({})
        .withStore(appStore)
        .withTaskManager(taskManager)
        .withModuleLoaders([])
        .withAppService(appService)
        .withWebService(webService)
        .build();
      expect(dockuiAppsInstance).toBeInstanceOf(DockUIApps);
    });
  });
});
