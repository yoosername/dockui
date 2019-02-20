const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const {
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT
} = require("../constants/events");

const { MockEventService, MockAppService } = require("../util/mocks");
var mockEventService = null;
var mockAppService = null;
var WebService = require("./WebService");

describe("WebService", function() {
  "use strict";

  beforeEach(function() {
    mockAppService = new MockAppService();
    mockEventService = new MockEventService();
  });

  it("should be defined and loadable", function() {
    expect(WebService).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(WebService).to.be.a("function");
  });

  it("should know if its running or not", function() {
    const web = new WebService(mockAppService, mockEventService);
    expect(web.isRunning()).to.equal(false);
    web.start();
    expect(web.isRunning()).to.equal(true);
    web.shutdown();
    expect(web.isRunning()).to.equal(false);
  });

  it("should fire start and stop events", function() {
    const spy = sinon.spy(mockEventService, "emit");
    const web = new WebService(mockAppService, mockEventService);
    web.start();
    expect(spy.calledTwice).to.equal(true);
  });

  // TODO (v0.0.1-Alpha): Add the following Managment endpoint units:
  //        Add a route for Management Rest API ( Takes precendence over Apps provided route of same name )
  //        List All Apps - GET /rest/admin/apps
  //        Attempt to Load App - POST /rest/admin/apps {url: "https:/location.of/descriptor.yml", permission: "READ"} - returns new App URI
  //        Get single App - GET /rest/admin/apps/{appKey}||{appUUID}
  //        Reload App (or change Permission) - PUT /rest/admin/apps/{appKey}||{appUUID} {url: "https:/location.of/descriptor.yml", permission: "READ"}
  //        Unload App - DELETE /rest/admin/apps/{appKey}||{appUUID}
  //        List Apps Modules - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules
  //        Enable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/enable
  //        Disable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/disable
  //        Enable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/enable
  //        Disable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/disable

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
