const SimpleKoaWebService = require("./SimpleKoaWebService");
const AppService = require("../../app/service/AppService");
const { Config } = require("../../config/Config");
const request = require("supertest");

jest.mock("../../app/service/AppService");

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

const setupTestAppService = () => {
  const base = new AppService();
  base.getApps.mockResolvedValue(TEST_APPS);
  base.getApp.mockResolvedValue(TEST_SINGLE_APP);
  base.loadApp.mockResolvedValue(TEST_LOADED_APP);
  base.unLoadApp.mockResolvedValue(TEST_DELETED_APP);
  base.getModules.mockResolvedValue(TEST_MODULES);
  base.getModule.mockResolvedValue(TEST_SINGLE_MODULE);
  return base;
};

// Follow example at: https://codeburst.io/lets-build-a-rest-api-with-koa-js-and-test-with-jest-2634c14394d3
let webService = null;
let appService = null;
let config = null;

describe("SimpleKoaWebService", function() {
  "use strict";

  beforeEach(async () => {
    process.env.DOCKUI_WEB_PORT = 10000;
    appService = setupTestAppService();
    config = new Config();
    try {
      webService = new SimpleKoaWebService({ appService, config });
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
      ).get("/api/manage/app/");
      expect(response.status).toEqual(500);
      await webServiceWithoutAppService.shutdown();
    });

    //List All Apps - GET /api/manage/app
    test("should be able to List all Apps", async () => {
      const response = await request(webService.getServer()).get(
        "/api/manage/app/"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_APPS);
    });

    test("should be able to show a single App", async () => {
      const response = await request(webService.getServer()).get(
        "/api/manage/app/12345"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_APP);
    });

    //   // Attempt to Load App - POST /api/manage/app
    test("should be able to Load an App", async () => {
      const body = { url: "/demo/demo.app.yml", permission: "read" };
      const response = await request(webService.getServer())
        .post("/api/manage/app/")
        .send(body)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_LOADED_APP);
    });

    test("should be able to UnLoad an App", async () => {
      const response = await request(webService.getServer())
        .delete("/api/manage/app/some_id")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_DELETED_APP);
    });

    //List Apps Modules - GET /api/manage/module
    test("should be able to List all Modules", async () => {
      const response = await request(webService.getServer()).get(
        "/api/manage/module/"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_MODULES);
    });

    test("should be able to show a single Module", async () => {
      const response = await request(webService.getServer()).get(
        "/api/manage/module/12345"
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(TEST_SINGLE_MODULE);
    });

    //   // Enable App - PUT /api/admin/app/:id/enable
    //   test("should be able to enable an App", function(done) {
    //     SimpleWebService = require("./SimpleWebService");
    //     const APP_NAME = "Appy";
    //     const getAppStub = sinon.stub(mockAppService, "getApp").returns({
    //       enable: () => {},
    //       getName: () => {
    //         return APP_NAME;
    //       }
    //     });
    //     webService = new SimpleWebService(mockAppService, mockEventService);

    //     // Check REST API returns correct results
    //     chai
    //       .request(webService.getExpressApp())
    //       .put("/api/admin/app/app1/enable")
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         getAppStub.restore();
    //         done();
    //       });
    //   });

    //   // Disable App - PUT /api/admin/app/:id/disable
    //   test("should be able to disable an App", function(done) {
    //     SimpleWebService = require("./SimpleWebService");
    //     const APP_NAME = "Appy";
    //     const getAppStub = sinon.stub(mockAppService, "getApp").returns({
    //       disable: () => {},
    //       getName: () => {
    //         return APP_NAME;
    //       }
    //     });
    //     webService = new SimpleWebService(mockAppService, mockEventService);

    //     // Check REST API returns correct results
    //     chai
    //       .request(webService.getExpressApp())
    //       .put("/api/admin/app/app1/disable")
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         getAppStub.restore();
    //         done();
    //       });
    //   });

    //   // Enable Module - PUT /api/admin/app/:id/modules/:moduleId/enable
    //   test("should be able to enable a Module", function(done) {
    //     SimpleWebService = require("./SimpleWebService");
    //     const APP_NAME = "Appy";
    //     const getAppStub = sinon.stub(mockAppService, "getApp").returns({
    //       getName: () => {
    //         return APP_NAME;
    //       },
    //       getModule: () => {
    //         return {
    //           getName: () => {
    //             return APP_NAME;
    //           },
    //           enable: () => {}
    //         };
    //       }
    //     });
    //     webService = new SimpleWebService(mockAppService, mockEventService);

    //     // Check REST API returns correct results
    //     chai
    //       .request(webService.getExpressApp())
    //       .put("/api/admin/app/app1/modules/module1/enable")
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         getAppStub.restore();
    //         done();
    //       });
    //   });

    //   // Disable Module - PUT /api/admin/app/:id/modules/:moduleId/disable
    //   test("should be able to disable a Module", function(done) {
    //     SimpleWebService = require("./SimpleWebService");
    //     const APP_NAME = "Appy";
    //     const getAppStub = sinon.stub(mockAppService, "getApp").returns({
    //       getName: () => {
    //         return APP_NAME;
    //       },
    //       getModule: () => {
    //         return {
    //           getName: () => {
    //             return APP_NAME;
    //           },
    //           disable: () => {}
    //         };
    //       }
    //     });
    //     webService = new SimpleWebService(mockAppService, mockEventService);

    //     // Check REST API returns correct results
    //     chai
    //       .request(webService.getExpressApp())
    //       .put("/api/admin/app/app1/modules/module1/disable")
    //       .end((err, res) => {
    //         res.should.have.status(200);
    //         getAppStub.restore();
    //         done();
    //       });
    //   });
  });

  // TODO (v0.0.2-Alpha):
  // Implement the concept of a URN for subject, resource
  // Implement the concept of action
  // Do this mapping early in the handling of traffic. (Perhaps after authentication) Examples:
  //
  //  User User1 performs GET against /api/apps
  //    Subject URN = urn:dockui:2ca6fec3:iam:user/User1
  //    Resource URN = urn:dockui:2ca6fec3:app:api/
  //    Action = { action "read" }
  //
  //  User Bob performs POST against /api/apps/c33de4ff/modules/6f77c12a/enable
  //    Subject URN = urn:dockui:2ca6fec3:iam:user/Bob
  //    Resource URN = urn:dockui:2ca6fec3:app:api/c33de4ff/modules/6f77c12a/enable
  //    Action = { action "write" }
  //
  //  App c33de4ff performs PUT against /api/apps/1.0/a3cc4ed2
  //    Subject URN = urn:dockui:2ca6fec3:app:c33de4ff
  //    Resource URN = urn:dockui:2ca6fec3:app:api:1.0:GET:/a3cc4ed2
  //    Action = { action "write" }

  // If there are no Authentication Provider modules then provide default as follows:
  //  - Authentication provider maps your request to predefined Anonimous access account
  //  - Authorization provider checks that the Resources allow Anonimous access.
  //  When designing a demo make sure it has some features with anon access and some locked down
});
