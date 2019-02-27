const chai = require("chai");
let should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.use(sinonChai);
var proxyquire = require("proxyquire");
var EventEmitter = require("events");

const {
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT,
  URL_APP_LOAD_REQUEST
} = require("../constants/events");

const { MockAppService } = require("../util/mocks");
var mockEventService = null;
var mockAppService = null;
var httpServerStub = null;
var useSpy = null;
var expressStub = null;
var WebService = null;
var webService = null;
var getAppsStub = null;

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

describe("WebService", function() {
  "use strict";

  beforeEach(function() {
    mockAppService = new MockAppService();
    // Custom mockAppService which produces 2 known Apps
    getAppsStub = sinon.stub(mockAppService, "getApps").returns(APPS);
    mockEventService = new EventEmitter();
    mockEventService.setMaxListeners(0);
    useSpy = sinon.spy();
    expressStub = sinon.stub().returns({
      use: useSpy,
      get: useSpy,
      post: useSpy,
      put: useSpy,
      delete: useSpy
    });
    httpServerStub = sinon.stub().returns({
      listen: (_, cb) => {
        cb();
      },
      close: cb => {
        cb();
      }
    });
    WebService = proxyquire("./WebService", {
      http: {
        createServer: httpServerStub
      },
      express: expressStub
    });
    webService = new WebService(mockAppService, mockEventService);
  });

  afterEach(function() {
    getAppsStub.restore();
  });

  it("should be defined and loadable", function() {
    expect(WebService).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(WebService).to.be.a("function");
  });

  it("should report if its running correctly", function() {
    expect(webService.isRunning()).to.equal(false);
    webService.start();
    expect(webService.isRunning()).to.equal(true);
    webService.shutdown();
    expect(webService.isRunning()).to.equal(false);
  });

  it("should fire starting events", function(done) {
    mockEventService.on(WEBSERVICE_STARTING_EVENT, () => {
      mockEventService.on(WEBSERVICE_STARTED_EVENT, () => {
        done();
      });
    });
    webService.start();
  });

  it("should fire shutdown events", function(done) {
    var count = 0;
    mockEventService.on(WEBSERVICE_STARTING_EVENT, () => {
      count++;
    });
    mockEventService.on(WEBSERVICE_SHUTTING_DOWN_EVENT, () => {
      mockEventService.on(WEBSERVICE_SHUTDOWN_EVENT, () => {
        count++;
        done();
      });
    });
    webService.start();
    expect(count).to.equal(1);
    webService.shutdown();
  });

  describe("DockUI Management API", function() {
    // Should have an Swagger Definition UI served from /api/admin/doc
    it("should define a Swagger API explorer @ /api/admin/doc", function() {
      webService.start();
      expect(useSpy).to.have.been.calledWith("/api/admin/doc");
    });

    // List All Apps - GET /api/admin/app
    it("should be able to List all Apps", function(done) {
      WebService = require("./WebService");
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
      const eventSpy = sinon.spy(mockEventService, "emit");
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
      const getAppStub = sinon.stub(mockAppService, "getApp").returns(APPS[1]);
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
      const getAppStub = sinon.stub(mockAppService, "getApp").returns(APPS[0]);
      const eventSpy = sinon.spy(mockEventService, "emit");
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
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
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
      const APP_NAME = "Appy";
      const getAppStub = sinon.stub(mockAppService, "getApp").returns({
        enable: () => {},
        getName: () => {
          return APP_NAME;
        }
      });
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
      const APP_NAME = "Appy";
      const getAppStub = sinon.stub(mockAppService, "getApp").returns({
        disable: () => {},
        getName: () => {
          return APP_NAME;
        }
      });
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
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
      webService = new WebService(mockAppService, mockEventService);

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
      WebService = require("./WebService");
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
      webService = new WebService(mockAppService, mockEventService);

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
