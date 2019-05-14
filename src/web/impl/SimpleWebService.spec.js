const SimpleWebService = require("./SimpleWebService");
const request = require("supertest");

// Follow example at: https://codeburst.io/lets-build-a-rest-api-with-koa-js-and-test-with-jest-2634c14394d3
// Intergation test for the management API

// TODO Test this

const APPS = [
  {
    uuid: "234732048957-43257457-3495-9345934",
    key: "app1",
    name: "App 1"
  },
  {
    uuid: "353652048955-434f5457-3234-9347867",
    key: "app2",
    name: "App 2"
  }
];

describe("SimpleWebService", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  it("should be defined and loadable", function() {
    expect(SimpleWebService).not.toBeUndefined();
  });

  it("should be a function", function() {
    expect(typeof SimpleWebService).toBe("function");
  });

  it("should report if its running correctly", function() {
    expect(webService.isRunning()).toBe(false);
    webService.start();
    expect(webService.isRunning()).toBe(true);
    webService.shutdown();
    expect(webService.isRunning()).toBe(false);
  });

  describe("DockUI Management API", function() {
    // Should have an Swagger Definition UI served from /api/admin/doc
    it("should define a Swagger API explorer @ /api/admin/doc", function() {
      webService.start();
      expect(useSpy).to.have.been.calledWith("/api/admin/doc");
    });

    // List All Apps - GET /api/admin/app
    it("should be able to List all Apps", function(done) {
      SimpleWebService = require("./SimpleWebService");
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .get("/api/admin/app")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.equal(2);
          res.body.should.eql(APPS);
          done();
        });
    });

    // Attempt to Load App - POST /api/admin/app
    it("should be able to load a single App", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const eventSpy = sinon.spy(mockEventService, "emit");
      webService = new SimpleWebService(mockAppService, mockEventService);

      let appRequest = {
        key: "https:/location.of/descriptor.yml",
        permission: "READ"
      };
      chai
        .request(webService.getExpressApp())
        .post("/api/admin/app")
        .send(appRequest)
        .end((err, res) => {
          expect(mockEventService.emit).to.have.been.calledOnce;
          expect(mockEventService.emit.getCall(0).args[1].requestId).to.be.not
            .null;
          var requestId = mockEventService.emit.getCall(0).args[1].requestId;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("requestId");
          res.body.requestId.should.equal(requestId);
          eventSpy.restore();
          done();
        });
    });

    // Get single App - GET /api/admin/app/:id
    it("should be able to get a single App", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const getAppStub = sinon.stub(mockAppService, "getApp").returns(APPS[1]);
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .get("/api/admin/app/app2")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.eql(APPS[1]);
          getAppStub.restore();
          done();
        });
    });

    // Unload App - DELETE /api/admin/app/:id
    it("should be able to unload a single App", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const getAppStub = sinon.stub(mockAppService, "getApp").returns(APPS[0]);
      const eventSpy = sinon.spy(mockEventService, "emit");
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .delete("/api/admin/app/app1")
        .end((err, res) => {
          expect(mockEventService.emit).to.have.been.calledOnce;
          expect(mockEventService.emit.getCall(0).args[1].requestId).to.be.not
            .null;
          var requestId = mockEventService.emit.getCall(0).args[1].requestId;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("requestId");
          res.body.requestId.should.equal(requestId);
          eventSpy.restore();
          done();
        });
    });

    // List Apps Modules - GET /api/admin/app/:id/modules
    it("should be able to list a single Apps Modules", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const FAKE_MODULES = [
        { key: "module1", name: "Module 1" },
        { key: "module2", name: "Module 2" },
        { key: "module3", name: "Module 3" }
      ];
      const getAppStub = sinon.stub(mockAppService, "getApp").returns({
        getModules: () => {
          return FAKE_MODULES;
        }
      });
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .get("/api/admin/app/app1/modules")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.should.eql(FAKE_MODULES);
          getAppStub.restore();
          done();
        });
    });

    // Enable App - PUT /api/admin/app/:id/enable
    it("should be able to enable an App", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const APP_NAME = "Appy";
      const getAppStub = sinon.stub(mockAppService, "getApp").returns({
        enable: () => {},
        getName: () => {
          return APP_NAME;
        }
      });
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .put("/api/admin/app/app1/enable")
        .end((err, res) => {
          res.should.have.status(200);
          getAppStub.restore();
          done();
        });
    });

    // Disable App - PUT /api/admin/app/:id/disable
    it("should be able to disable an App", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const APP_NAME = "Appy";
      const getAppStub = sinon.stub(mockAppService, "getApp").returns({
        disable: () => {},
        getName: () => {
          return APP_NAME;
        }
      });
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .put("/api/admin/app/app1/disable")
        .end((err, res) => {
          res.should.have.status(200);
          getAppStub.restore();
          done();
        });
    });

    // Enable Module - PUT /api/admin/app/:id/modules/:moduleId/enable
    it("should be able to enable a Module", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const APP_NAME = "Appy";
      const getAppStub = sinon.stub(mockAppService, "getApp").returns({
        getName: () => {
          return APP_NAME;
        },
        getModule: () => {
          return {
            getName: () => {
              return APP_NAME;
            },
            enable: () => {}
          };
        }
      });
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .put("/api/admin/app/app1/modules/module1/enable")
        .end((err, res) => {
          res.should.have.status(200);
          getAppStub.restore();
          done();
        });
    });

    // Disable Module - PUT /api/admin/app/:id/modules/:moduleId/disable
    it("should be able to disable a Module", function(done) {
      SimpleWebService = require("./SimpleWebService");
      const APP_NAME = "Appy";
      const getAppStub = sinon.stub(mockAppService, "getApp").returns({
        getName: () => {
          return APP_NAME;
        },
        getModule: () => {
          return {
            getName: () => {
              return APP_NAME;
            },
            disable: () => {}
          };
        }
      });
      webService = new SimpleWebService(mockAppService, mockEventService);

      // Check REST API returns correct results
      chai
        .request(webService.getExpressApp())
        .put("/api/admin/app/app1/modules/module1/disable")
        .end((err, res) => {
          res.should.have.status(200);
          getAppStub.restore();
          done();
        });
    });
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
