const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
var proxyquire = require("proxyquire");
var EventEmitter = require("events");

const {
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT
} = require("../constants/events");

const { MockAppService } = require("../util/mocks");
var mockEventService = null;
var mockAppService = null;
var httpServerStub = null;
var useSpy = null;
var expressStub = null;
var WebService = null;
var webService = null;

describe("WebService", function() {
  "use strict";

  beforeEach(function() {
    mockAppService = new MockAppService();
    mockEventService = new EventEmitter();
    useSpy = sinon.spy();
    expressStub = sinon.stub().returns({
      use: useSpy
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

  it("should fire stopping events", function(done) {
    mockEventService.on(WEBSERVICE_SHUTTING_DOWN_EVENT, () => {
      mockEventService.on(WEBSERVICE_SHUTDOWN_EVENT, () => {
        done();
      });
    });
    webService.start();
    webService.shutdown();
  });

  describe("DockUI Management API", function() {
    // Should have an Swagger Definition UI served from /api/admin/docs
    it("Should have an Swagger UI representing API at /api/admin/docs", function() {
      webService.start();
      expect(useSpy).to.have.been.calledWith("/api/admin/docs");
    });

    // TODO (v0.0.1-Alpha): Add the following Managment endpoint units:
    //        Add a route for Management Rest API ( Takes precendence over Apps provided route of same name
    //        List All Apps - GET /rest/admin/apps
    //it("should be able to List all Apps", function() {
    //
    //});
    //        Attempt to Load App - POST /rest/admin/apps {url: "https:/location.of/descriptor.yml", permission: "READ"} - returns new App URI
    //it("should be able to load a single App", function() {
    //
    //});
    //        Get single App - GET /rest/admin/apps/{appKey}||{appUUID}
    //        Reload App (or change Permission) - PUT /rest/admin/apps/{appKey}||{appUUID} {url: "https:/location.of/descriptor.yml", permission: "READ"}
    //        Unload App - DELETE /rest/admin/apps/{appKey}||{appUUID}
    //        List Apps Modules - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules
    //        Enable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/enable
    //        Disable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/disable
    //        Enable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/enable
    //        Disable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/disable
  });

  // TODO (v0.0.1-Alpha): Test that we are following 12 Factor Rules (to ensure scalability etc) aka:
  // I. Codebase
  //   One codebase tracked in revision control, many deploys
  // II. Dependencies
  //   Explicitly declare and isolate dependencies
  // III. Config
  //   Store config in the environment
  // IV. Backing services
  //   Treat backing services as attached resources
  // V. Build, release, run
  //   Strictly separate build and run stages
  // VI. Processes
  //   Execute the app as one or more stateless processes
  // VII. Port binding
  //   Export services via port binding
  // VIII. Concurrency
  //   Scale out via the process model
  // IX. Disposability
  //   Maximize robustness with fast startup and graceful shutdown
  // X. Dev/prod parity
  //   Keep development, staging, and production as similar as possible
  // XI. Logs
  //   Treat logs as event streams
  // XII. Admin processes
  //   Run admin/management tasks as one-off processes

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
