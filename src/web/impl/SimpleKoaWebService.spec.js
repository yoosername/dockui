const SimpleKoaWebService = require("./SimpleKoaWebService");
const AppService = require("../../app/service/AppService");
const TaskManager = require("../../task/manager/TaskManager");
const { Config } = require("../../config/Config");
const request = require("supertest");
const execSync = require("child_process").execSync;

jest.mock("../../app/service/AppService");
jest.mock("../../task/manager/TaskManager");

var TEST_MODULES = [{ key: "1" }, { key: "2" }];
var TEST_SINGLE_MODULE = { key: "im-a-key" };

var TEST_APPS = [
  {
    key: "testApp1",
    loaded: "true",
    enabled: "true",
    modules: TEST_MODULES
  },
  {
    key: "testApp2",
    loaded: "false",
    enabled: "false"
  },
  {
    key: "testApp3",
    loaded: "true",
    enabled: "false"
  },
  {
    key: "testApp4",
    loaded: "true",
    enabled: "true"
  }
];

const TEST_LOADED_APP = {
  key: "testApp5",
  loaded: "true",
  enabled: "false"
};

const TEST_SINGLE_APP = {
  key: "testApp6",
  loaded: "true",
  enabled: "false"
};

const TEST_DELETED_APP = {
  key: "deleted",
  loaded: "false",
  enabled: "false"
};

const TEST_TASKS = {
  queue: "",
  inProgress: "",
  successful: "",
  failed: ""
};

const TEST_TASK = {
  id: "test"
};

const setupTestTaskManager = () => {
  const base = new TaskManager();
  base.getTasks.mockImplementation(type => {
    if (type) {
      return { [type]: TEST_TASKS[type] };
    }
    return TEST_TASKS;
  });
  base.getTask.mockReturnValue(TEST_TASK);
  return base;
};

const setupTestAppService = () => {
  const base = new AppService();
  base.getApps.mockResolvedValue(TEST_APPS);
  base.getApp.mockResolvedValue(TEST_SINGLE_APP);
  base.enableApp.mockResolvedValue(TEST_SINGLE_APP);
  base.disableApp.mockResolvedValue(TEST_SINGLE_APP);
  base.loadApp.mockResolvedValue(TEST_LOADED_APP);
  base.unloadApp.mockResolvedValue(TEST_DELETED_APP);
  base.getModules.mockResolvedValue(TEST_MODULES);
  base.getModule.mockResolvedValue(TEST_SINGLE_MODULE);
  base.enableModule.mockResolvedValue(TEST_SINGLE_MODULE);
  base.disableModule.mockResolvedValue(TEST_SINGLE_MODULE);
  return base;
};

// Follow example at: https://codeburst.io/lets-build-a-rest-api-with-koa-js-and-test-with-jest-2634c14394d3
let webService = null;
let appService = null;
let taskManager = null;
let config = null;

describe("SimpleKoaWebService", function() {
  "use strict";

  beforeAll(async () => {
    execSync("tools/gen_ssl_cert.sh &>/dev/null");
  });

  beforeEach(async () => {
    process.env.DOCKUI_WEB_PORT = 10000;
    appService = setupTestAppService();
    taskManager = setupTestTaskManager();
    config = new Config();
    try {
      webService = new SimpleKoaWebService({ appService, taskManager, config });
      await webService.start();
    } catch (e) {
      console.error("couldnt start webService : ", e);
    }
  });

  afterEach(async () => {
    await webService.shutdown();
  });

  test("should be defined and loadable", () => {
    expect(SimpleKoaWebService).not.toBeUndefined();
    expect(typeof SimpleKoaWebService).toBe("function");
  });

  test("should report if its running correctly", async () => {
    expect(webService.isRunning()).toBe(true);
    await webService.shutdown();
    expect(webService.isRunning()).toBe(false);
  });

  test("should serve health endpoint at /health", async () => {
    const response = await request(webService.getServer()).get("/health");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ status: "running" });
  });

  test("should set best practice security headers", async () => {
    const response = await request(webService.getServer()).get("/health");
    expect(Object.keys(response.headers)).toEqual(
      expect.arrayContaining([
        "x-dns-prefetch-control",
        "x-frame-options",
        "strict-transport-security",
        "x-download-options",
        "x-content-type-options",
        "x-xss-protection"
      ])
    );

    // dnsPrefetchControl
    expect(response.headers["x-dns-prefetch-control"]).toEqual("off");
    // frameguard
    expect(response.headers["x-frame-options"]).toEqual("SAMEORIGIN");
    // hsts: Not enabled in HTTP
    expect(response.headers["strict-transport-security"]).toEqual(
      "max-age=15552000; includeSubDomains"
    );
    // ieNoOpen
    expect(response.headers["x-download-options"]).toEqual("noopen");
    // noSniff
    expect(response.headers["x-content-type-options"]).toEqual("nosniff");
    // xssFilter
    expect(response.headers["x-xss-protection"]).toEqual("1; mode=block");
  });

  describe("DockUI Management API", function() {
    test("should return swagger.json from the API root", async () => {
      const response = await request(webService.getServer()).get(
        "/api/swagger.json"
      );
      expect(response.status).toEqual(200);
      expect(response.type).toEqual("application/json");
      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining([
          "swagger",
          "info",
          "basePath",
          "tags",
          "schemes",
          "paths",
          "definitions",
          "externalDocs"
        ])
      );
    });

    // test("should redirect if missing traliing slash", async () => {
    //   const response = await request(webService.getServer()).get("/api");
    //   expect(response.status).toEqual(301);
    // });

    test("should serve Swagger UI @ /api/", async () => {
      const response = await request(webService.getServer()).get("/api/");
      expect(response.status).toEqual(200);
      expect(response.text).toContain('id="swagger-ui"');
    });

    test("should return 500 if AppService not running", async () => {
      console.error = jest.fn().mockImplementation();
      const webServiceWithoutAppService = new SimpleKoaWebService();
      await webServiceWithoutAppService.start();
      const response = await request(
        webServiceWithoutAppService.getServer()
      ).get("/api/v1/admin/app");
      expect(response.status).toEqual(500);
      await webServiceWithoutAppService.shutdown();
    });

    //List All Apps - GET /api/manage/app
    test("should be able to List all Apps", async () => {
      const response = await request(webService.getServer()).get(
        "/api/v1/admin/app"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_APPS);
    });

    test("should be able to show a single App", async () => {
      const response = await request(webService.getServer()).get(
        "/api/v1/admin/app/12345"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_APP);
    });

    //   // Attempt to Load App - POST /api/manage/app
    test("should be able to Load an App", async () => {
      const body = { url: "/demo/demo.app.yml", permission: "read" };
      const response = await request(webService.getServer())
        .post("/api/v1/admin/app/")
        .send(body)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_LOADED_APP);
    });

    test("should be able to UnLoad an App", async () => {
      const response = await request(webService.getServer())
        .delete("/api/v1/admin/app/some_id")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_DELETED_APP);
    });

    //List Apps Modules - GET /api/manage/module
    test("should be able to List all Modules", async () => {
      const response = await request(webService.getServer()).get(
        "/api/v1/admin/module/"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_MODULES);
    });

    test("should be able to show a single Module", async () => {
      const response = await request(webService.getServer()).get(
        "/api/v1/admin/module/12345"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_MODULE);
    });

    test("should be able to enable an App", async () => {
      const response = await request(webService.getServer()).put(
        "/api/v1/admin/app/12345/enable"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_APP);
    });

    test("should be able to disable an App", async () => {
      const response = await request(webService.getServer()).put(
        "/api/v1/admin/app/12345/disable"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_APP);
    });

    test("should be able to enable a Module", async () => {
      const response = await request(webService.getServer()).put(
        "/api/v1/admin/module/12345/enable"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_MODULE);
    });

    test("should be able to disable a Module", async () => {
      const response = await request(webService.getServer()).put(
        "/api/v1/admin/module/12345/disable"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_MODULE);
    });

    test("should be able to list all tasks (optionally filtering on status)", async () => {
      let response = await request(webService.getServer()).get(
        "/api/v1/admin/task"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_TASKS);

      response = await request(webService.getServer()).get(
        "/api/v1/admin/task?status=inProgress"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ inProgress: TEST_TASKS.inProgress });
    });

    test("should be able to list a single task", async () => {
      let response = await request(webService.getServer()).get(
        "/api/v1/admin/task/12345"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_TASK);
    });

    test("should be able to switch https on or off with ENV", async () => {
      expect(webService.getScheme()).toEqual("http");
      expect(webService.isRunning()).toEqual(true);
      try {
        webService.shutdown();
        config.set("web.scheme", "https");
        config.set("web.ssl.cert", "/tmp/dockui.server.cert");
        config.set("web.ssl.key", "/tmp/dockui.server.key");
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        webService = new SimpleKoaWebService({
          appService,
          taskManager,
          config
        });
        await webService.start();
      } catch (e) {
        console.error("couldnt start webService : ", e);
      }

      expect(webService.getScheme()).toEqual("https");
      expect(webService.isRunning()).toEqual(true);
    });
  });
});
