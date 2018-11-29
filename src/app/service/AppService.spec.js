const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
  APP_SERVICE_STARTING_EVENT,
  APP_SERVICE_STARTED_EVENT,
  APP_SERVICE_SHUTTING_DOWN_EVENT,
  APP_SERVICE_SHUTDOWN_EVENT,
  APP_ENABLED_EVENT,
  APP_DISABLED_EVENT
} = require("../../constants/events");

const  {
  appServiceValidationError
} = require("../../constants/errors");

const  {
  MockLoader,
  MockLoaders,
  MockAppStore,
  MockLifecycleEventsStrategy,
  MockEventService
} = require("../../util/mocks");

var AppService = require('./appService');

var mockLoader = null;
var mockLoaders = null;
var mockAppStore = null;
var mockLifecycleEventsStrategy = null;
var mockEventService = null;

describe('AppService', function() {
    "use strict";

    beforeEach(function(){
      mockLoader = new MockLoader();
      mockLoaders = new MockLoaders(mockLoader);
      mockAppStore = new MockAppStore();
      mockLifecycleEventsStrategy = new MockLifecycleEventsStrategy();
      mockEventService = new MockEventService();
    });

    it('should be defined and loadable', function() {
      expect(AppService).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(AppService).to.be.a('function');
    });

    it('should validate arguments and throw if wrong', function() {
      expect(()=>{
        new AppService(null, null, null, null);
      }).to.throw(appServiceValidationError);
      expect(()=>{
        new AppService();
      }).to.throw(appServiceValidationError);
      expect(()=>{
        new AppService(mockLoaders, mockAppStore, mockEventService);
      }).to.throw(appServiceValidationError);
      expect(()=>{
        new AppService(mockLoaders, mockEventService);
      }).to.throw(appServiceValidationError);
      expect(()=>{
        new AppService(mockAppStore);
      }).to.throw(appServiceValidationError);
      expect(()=>{
        new AppService(mockLoaders, mockAppStore, mockLifecycleEventsStrategy, mockEventService);
      }).to.not.throw();
    });

    it('should run scanForNewApps and set _running to true on start', function() {
      var appService = new AppService(
        mockLoaders, 
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

    it('should cause loaders to run scanForNewApps on start', function() {
      var loader1 = mockLoaders[0];
      sinon.spy(loader1,"scanForNewApps");

      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.start();

      expect(loader1.scanForNewApps.calledOnce).to.equal(true);
      loader1.scanForNewApps.restore();
    });

    it('should trigger setup on lifecycleEventsStrategy during start', function() {
      var strategySpy = sinon.spy(mockLifecycleEventsStrategy,"setup");
      
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );

      appService.start();
      expect(strategySpy).to.have.been.calledOnce;
      strategySpy.restore();
    });

    it('should trigger events on start / shutdown', function() {
      var events = sinon.mock(mockEventService);
      events.expects("trigger").once().calledWith(APP_SERVICE_STARTING_EVENT);
      events.expects("trigger").once().calledWith(APP_SERVICE_STARTED_EVENT);
      events.expects("trigger").once().calledWith(APP_SERVICE_SHUTTING_DOWN_EVENT);
      events.expects("trigger").once().calledWith(APP_SERVICE_SHUTDOWN_EVENT);
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.start();
      appService.shutdown();
      events.verify();
    });

    it('should run stopScanningForNewApps and set _running to false on shutdown', function() {
      var appService = new AppService(
        mockLoaders, 
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

    it('should cause loaders to run stopScanningForNewApps on shutdown', function() {
      var loader1Spy = sinon.spy(mockLoaders[0],"stopScanningForNewApps");

      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.start();
      appService.shutdown();
      expect(loader1Spy).to.have.been.calledOnce;
      loader1Spy.restore();
    });

    it('should call loaders scanForNewApps on scanForNewApps', function() {
      var AppLoader = sinon.mock(mockLoaders[0]);
      AppLoader.expects("scanForNewApps").once();
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.scanForNewApps();
      AppLoader.verify();
    });

    it('should call loaders stopScanningForNewApps on stopScanningForNewApps', function() {
      var AppLoader = sinon.mock(mockLoaders[0]);
      AppLoader.expects("stopScanningForNewApps").once();
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.stopScanningForNewApps();
      AppLoader.verify();
    });

    it('should call loaders getApps on getApps', function() {
      var AppLoader = sinon.mock(mockLoaders[0]);
      AppLoader.expects("getApps").once();
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.getApps();
      AppLoader.verify();
    });

    it('should call loaders getApps on getApp', function() {
      var AppLoader = sinon.mock(mockLoaders[0]);
      AppLoader.expects("getApps").once();
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.getApp();
      AppLoader.verify();
    });

    it('should call enableApp and disableApp in store during enable/disable', function() { 
      var store = sinon.mock(mockAppStore);
      store.expects("enableApp").once();
      store.expects("disableApp").once();
      var events = sinon.mock(mockEventService);
      events.expects("trigger").once().withArgs(APP_ENABLED_EVENT);
      events.expects("trigger").once().withArgs(APP_DISABLED_EVENT);

      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      appService.enableApp();
      appService.disableApp();
      store.verify();
      events.verify();
    });

    it('should call loaders getAppModules on getAppModules', function() {
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      var stub = sinon.stub().withArgs("App").returns({
        getModules: function(){ return [{},{}]}
      });
      appService.getApp = stub;
      var modules = appService.getAppModules();
      expect(modules.length).to.equal(2);
      
    });

    it('should call getAppModules on getAppModule', function() {
      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      var stub = sinon.stub().withArgs("App").returns({
        getModules: function(){ return [{
          getKey: function(){return "thisone"}
        },{
          getKey: function(){return "notthisone"}
        }]}
      });
      appService.getApp = stub;
      var module = appService.getAppModule("doesntmatter", "thisone");
      expect(module.getKey()).to.equal("thisone");
      
    });

    it('should call enableAppModule and disableAppModule in store during enable/disable', function() { 
      var enableModuleSpy = sinon.spy(mockAppStore, "enableAppModule");
      var disableModuleSpy = sinon.spy(mockAppStore, "disableAppModule");

      var appService = new AppService(
        mockLoaders, 
        mockAppStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );

      var stub = sinon.stub().withArgs("App").returns({
        getModules: function(){ return [{
          getKey: function(){return "thisone"}
        },{
          getKey: function(){return "notthisone"}
        }]}
      });

      appService.getApp = stub;
      appService.enableAppModule("doesntmatter", "thisone");
      appService.disableAppModule("doesntmatter", "thisone");

      expect(enableModuleSpy).to.have.been.calledOnce;
      expect(disableModuleSpy).to.have.been.calledOnce;
      enableModuleSpy.restore();
      disableModuleSpy.restore();
    });

});
