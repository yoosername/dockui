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

var AppService = require("./DefaultAppService");

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

  it("should run scanForNewApps and set _running to true on start", function() {
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    sinon.spy(appService, "scanForNewApps");

    expect(appService._running).to.equal(false);
    appService.start();
    expect(appService._running).to.equal(true);
    expect(appService.scanForNewApps.calledOnce).to.equal(true);

    appService.scanForNewApps.restore();
  });

  it("should cause loaders to run scanForNewApps on start", function() {
    var loader1 = mockAppLoaders[0];
    sinon.spy(loader1, "scanForNewApps");

    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.start();

    expect(loader1.scanForNewApps.calledOnce).to.equal(true);
    loader1.scanForNewApps.restore();
  });

  it("should trigger setup on lifecycleEventsStrategy during start", function() {
    var strategySpy = sinon.spy(mockLifecycleEventsStrategy, "setup");

    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );

    appService.start();
    expect(strategySpy).to.have.been.calledOnce;
    strategySpy.restore();
  });

  it("should emit events on start / shutdown", function() {
    var events = sinon.mock(mockEventService);
    events
      .expects("emit")
      .once()
      .calledWith(APP_SERVICE_STARTING_EVENT);
    events
      .expects("emit")
      .once()
      .calledWith(APP_SERVICE_STARTED_EVENT);
    events
      .expects("emit")
      .once()
      .calledWith(APP_SERVICE_SHUTTING_DOWN_EVENT);
    events
      .expects("emit")
      .once()
      .calledWith(APP_SERVICE_SHUTDOWN_EVENT);
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.start();
    appService.shutdown();
    events.verify();
  });

  it("should run stopScanningForNewApps and set _running to false on shutdown", function() {
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    var mockService = sinon.mock(appService);
    mockService.expects("stopScanningForNewApps").once();

    appService.start();
    expect(appService._running).to.equal(true);
    appService.shutdown();
    expect(appService._running).to.equal(false);

    mockService.verify();
  });

  it("should cause loaders to run stopScanningForNewApps on shutdown", function() {
    var loader1Spy = sinon.spy(mockAppLoaders[0], "stopScanningForNewApps");

    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.start();
    appService.shutdown();
    expect(loader1Spy).to.have.been.calledOnce;
    loader1Spy.restore();
  });

  it("should call loaders scanForNewApps on scanForNewApps", function() {
    var AppLoader = sinon.mock(mockAppLoaders[0]);
    AppLoader.expects("scanForNewApps").once();
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.scanForNewApps();
    AppLoader.verify();
  });

  it("should call loaders stopScanningForNewApps on stopScanningForNewApps", function() {
    var AppLoader = sinon.mock(mockAppLoaders[0]);
    AppLoader.expects("stopScanningForNewApps").once();
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.stopScanningForNewApps();
    AppLoader.verify();
  });

  it("should call loaders getApps on getApps", function() {
    var AppLoader = sinon.mock(mockAppLoaders[0]);
    AppLoader.expects("getApps").once();
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.getApps();
    AppLoader.verify();
  });

  it("should call loaders getApps on getApp", function() {
    var AppLoader = sinon.mock(mockAppLoaders[0]);
    AppLoader.expects("getApps").once();
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    appService.getApp();
    AppLoader.verify();
  });

  it("should call loaders getModules on getModules", function() {
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    var stub = sinon
      .stub()
      .withArgs("App")
      .returns({
        getModules: function() {
          return [{}, {}];
        }
      });
    appService.getApp = stub;
    var modules = appService.getModules();
    expect(modules.length).to.equal(2);
  });

  it("should call getModules on getModule", function() {
    var appService = new AppService(
      mockAppLoaders,
      mockAppStore,
      mockLifecycleEventsStrategy,
      mockEventService
    );
    var stub = sinon
      .stub()
      .withArgs("App")
      .returns({
        getModules: function() {
          return [
            {
              getKey: function() {
                return "thisone";
              }
            },
            {
              getKey: function() {
                return "notthisone";
              }
            }
          ];
        }
      });
    appService.getApp = stub;
    var module = appService.getModule("doesntmatter", "thisone");
    expect(module.getKey()).to.equal("thisone");
  });
});
