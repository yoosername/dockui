const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const {
  APP_SERVICE_STARTING_EVENT,
  APP_SERVICE_STARTED_EVENT,
  APP_SERVICE_SHUTTING_DOWN_EVENT,
  APP_SERVICE_SHUTDOWN_EVENT
} = require("../../constants/events");

const { appServiceValidationError } = require("../../constants/errors");

const {
  MockAppLoader,
  MockAppLoaders,
  MockAppStore,
  MockLifecycleEventsStrategy,
  MockEventService
} = require("../../util/mocks");

var AppService = require("./appService");

var mockAppLoader = null;
var mockAppLoaders = null;
var mockAppStore = null;
var mockLifecycleEventsStrategy = null;
var mockEventService = null;

describe("AppService", function() {
  "use strict";

  beforeEach(function() {
    mockAppLoader = new MockAppLoader();
    mockAppLoaders = new MockAppLoaders(mockAppLoader);
    mockAppStore = new MockAppStore();
    mockLifecycleEventsStrategy = new MockLifecycleEventsStrategy();
    mockEventService = new MockEventService();
  });

  it("should be defined and loadable", function() {
    expect(AppService).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(AppService).to.be.a("function");
  });

  it("should validate arguments and throw if wrong", function() {
    expect(() => {
      new AppService(null, null, null, null);
    }).to.throw(appServiceValidationError);
    expect(() => {
      new AppService();
    }).to.throw(appServiceValidationError);
    expect(() => {
      new AppService(mockAppLoaders, mockAppStore, mockEventService);
    }).to.throw(appServiceValidationError);
    expect(() => {
      new AppService(mockAppLoaders, mockEventService);
    }).to.throw(appServiceValidationError);
    expect(() => {
      new AppService(mockAppStore);
    }).to.throw(appServiceValidationError);
    expect(() => {
      new AppService(
        mockAppLoaders,
        mockAppStore,
        mockLifecycleEventsStrategy,
        mockEventService
      );
    }).to.not.throw();
  });

  it("should have correct signature", function() {
    const appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    expect(appService.start).to.be.a("function");
    expect(appService.shutdown).to.be.a("function");
    expect(appService.scanForNewApps).to.be.a("function");
    expect(appService.stopScanningForNewApps).to.be.a("function");
    expect(appService.getApps).to.be.a("function");
    expect(appService.getApp).to.be.a("function");
    expect(appService.getModules).to.be.a("function");
    expect(appService.getModule).to.be.a("function");

    // TODO, add extra sigs
    // "getContext",
    // "start",
    // "shutdown",
    // "scanForNewApps",
    // "stopScanningForNewApps",
    // "loadApp",
    // "unloadApp",
    // "enableApp",
    // "disableApp",
    // "getApps",
    // "getApp",
    // "loadModule",
    // "unloadModule",
    // "getModules",
    // "getModule",
    // "enableModule",
    // "disableModule",
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = sinon.stub(console, "warn");
    const appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.start();
    appService.shutdown();
    appService.scanForNewApps();
    appService.stopScanningForNewApps();
    appService.getApps();
    appService.getApp();
    appService.getModules();
    appService.getModule();
    expect(logSpy).to.be.called.callCount(8);
    logSpy.restore();
  });
});
