const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const { MockAppService, MockEventService } = require("../util/mocks");
const WebService = require("./WebService");
var mockAppService;
var mockEventService;
var webService;

describe("WebService", function() {
  "use strict";

  beforeEach(function() {
    mockAppService = new MockAppService();
    mockEventService = new MockEventService();
    webService = new WebService(mockAppService, mockEventService);
  });

  it("should be defined and a loadable function", function() {
    expect(WebService).to.not.be.undefined;
    expect(WebService).to.be.a("function");
  });

  it("should have correct signature", function() {
    expect(webService.setupMiddleware).to.be.a("function");
    expect(webService.start).to.be.a("function");
    expect(webService.shutdown).to.be.a("function");
    expect(webService.isRunning).to.be.a("function");
    expect(webService.getAppService).to.be.a("function");
    expect(webService.getEventService).to.be.a("function");
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = sinon.stub(console, "warn");
    webService.setupMiddleware();
    webService.start();
    webService.shutdown();
    webService.isRunning();
    webService.getAppService();
    webService.getEventService();
    expect(logSpy).to.be.called.callCount(6);
    logSpy.restore();
  });
});
