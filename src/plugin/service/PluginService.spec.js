const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
  PLUGIN_SERVICE_STARTING_EVENT,
  PLUGIN_SERVICE_STARTED_EVENT,
  PLUGIN_SERVICE_SHUTTING_DOWN_EVENT,
  PLUGIN_SERVICE_SHUTDOWN_EVENT,
  PLUGIN_ENABLED_EVENT,
  PLUGIN_DISABLED_EVENT
} = require("../../constants/events");

const  {
  PluginServiceValidationError
} = require("../../constants/errors");

var PluginService = require('./PluginService');
var mockLoader = null;
var mockLoaders = null;
var mockPluginStore = null;
var mockLifecycleEventsStrategy = null;
var mockEventService = null;

describe('PluginService', function() {
    "use strict";

    beforeEach(function(){
      mockLoader = { 
        scanForNewPlugins: function () {},
        stopScanningForNewPlugins: function () {},
        getPlugins: function(){}
      };
      mockLoaders = [
        Object.assign({},mockLoader),
        Object.assign({},mockLoader),
        Object.assign({},mockLoader)
      ];
      mockPluginStore = { 
        get: function () {}, 
        set: function () {},
        enablePlugin: function(){},
        disablePlugin: function(){},
        enablePluginModule: function(){},
        disablePluginModule: function(){}
      };
      mockLifecycleEventsStrategy = {
        setup: function () {},
        teardown: function () {}
      };
      mockEventService = { 
        on: function () {}, 
        trigger: function () {}, 
        addListener: function(){},
        removeListener: function () {} 
      };
    });

    it('should be defined and loadable', function() {
      expect(PluginService).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(PluginService).to.be.a('function');
    });

    it('should validate arguments and throw if wrong', function() {
      expect(()=>{
        new PluginService(null, null, null, null);
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService();
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService(mockLoaders, mockPluginStore, mockEventService);
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService(mockLoaders, mockEventService);
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService(mockPluginStore);
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService(mockLoaders, mockPluginStore, mockLifecycleEventsStrategy, mockEventService);
      }).to.not.throw();
    });

    it('should run scanForNewPlugins and set _running to true on start', function() {
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      sinon.spy(pluginService, "scanForNewPlugins");
      
      expect(pluginService._running).to.equal(false);
      pluginService.start();
      expect(pluginService._running).to.equal(true);
      expect(pluginService.scanForNewPlugins.calledOnce).to.equal(true);

      pluginService.scanForNewPlugins.restore();
    });

    it('should cause loaders to run scanForNewPlugins on start', function() {
      var loader1 = mockLoaders[0];
      sinon.spy(loader1,"scanForNewPlugins");

      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.start();

      expect(loader1.scanForNewPlugins.calledOnce).to.equal(true);
      loader1.scanForNewPlugins.restore();
    });

    it('should trigger setup on lifecycleEventsStrategy during start', function() {
      var strategySpy = sinon.spy(mockLifecycleEventsStrategy,"setup");
      
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );

      pluginService.start();
      expect(strategySpy).to.have.been.calledOnce;
      strategySpy.restore();
    });

    it('should trigger events on start / shutdown', function() {
      var events = sinon.mock(mockEventService);
      events.expects("trigger").once().calledWith(PLUGIN_SERVICE_STARTING_EVENT);
      events.expects("trigger").once().calledWith(PLUGIN_SERVICE_STARTED_EVENT);
      events.expects("trigger").once().calledWith(PLUGIN_SERVICE_SHUTTING_DOWN_EVENT);
      events.expects("trigger").once().calledWith(PLUGIN_SERVICE_SHUTDOWN_EVENT);
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.start();
      pluginService.shutdown();
      events.verify();
    });

    it('should run stopScanningForNewPlugins and set _running to false on shutdown', function() {
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      var mockService = sinon.mock(pluginService);
      mockService.expects("stopScanningForNewPlugins").once();
      
      pluginService.start();
      expect(pluginService._running).to.equal(true);
      pluginService.shutdown();
      expect(pluginService._running).to.equal(false);

      mockService.verify();
    });

    it('should cause loaders to run stopScanningForNewPlugins on shutdown', function() {
      var loader1Spy = sinon.spy(mockLoaders[0],"stopScanningForNewPlugins");

      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.start();
      pluginService.shutdown();
      expect(loader1Spy).to.have.been.calledOnce;
      loader1Spy.restore();
    });

    it('should call loaders scanForNewPlugins on scanForNewPlugins', function() {
      var pluginLoader = sinon.mock(mockLoaders[0]);
      pluginLoader.expects("scanForNewPlugins").once();
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.scanForNewPlugins();
      pluginLoader.verify();
    });

    it('should call loaders stopScanningForNewPlugins on stopScanningForNewPlugins', function() {
      var pluginLoader = sinon.mock(mockLoaders[0]);
      pluginLoader.expects("stopScanningForNewPlugins").once();
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.stopScanningForNewPlugins();
      pluginLoader.verify();
    });

    it('should call loaders getPlugins on getPlugins', function() {
      var pluginLoader = sinon.mock(mockLoaders[0]);
      pluginLoader.expects("getPlugins").once();
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.getPlugins();
      pluginLoader.verify();
    });

    it('should call loaders getPlugins on getPlugin', function() {
      var pluginLoader = sinon.mock(mockLoaders[0]);
      pluginLoader.expects("getPlugins").once();
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.getPlugin();
      pluginLoader.verify();
    });

    it('should call enablePlugin and disablePlugin in store during enable/disable', function() { 
      var store = sinon.mock(mockPluginStore);
      store.expects("enablePlugin").once();
      store.expects("disablePlugin").once();
      var events = sinon.mock(mockEventService);
      events.expects("trigger").once().withArgs(PLUGIN_ENABLED_EVENT);
      events.expects("trigger").once().withArgs(PLUGIN_DISABLED_EVENT);

      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      pluginService.enablePlugin();
      pluginService.disablePlugin();
      store.verify();
      events.verify();
    });

    it('should call loaders getPluginModules on getPluginModules', function() {
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      var stub = sinon.stub().withArgs("plugin").returns({
        getModules: function(){ return [{},{}]}
      });
      pluginService.getPlugin = stub;
      var modules = pluginService.getPluginModules();
      expect(modules.length).to.equal(2);
      
    });

    it('should call getPluginModules on getPluginModule', function() {
      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );
      var stub = sinon.stub().withArgs("plugin").returns({
        getModules: function(){ return [{
          getKey: function(){return "thisone"}
        },{
          getKey: function(){return "notthisone"}
        }]}
      });
      pluginService.getPlugin = stub;
      var module = pluginService.getPluginModule("doesntmatter", "thisone");
      expect(module.getKey()).to.equal("thisone");
      
    });

    it('should call enablePluginModule and disablePluginModule in store during enable/disable', function() { 
      var enableModuleSpy = sinon.spy(mockPluginStore, "enablePluginModule");
      var disableModuleSpy = sinon.spy(mockPluginStore, "disablePluginModule");

      var pluginService = new PluginService(
        mockLoaders, 
        mockPluginStore, 
        mockLifecycleEventsStrategy, 
        mockEventService
      );

      var stub = sinon.stub().withArgs("plugin").returns({
        getModules: function(){ return [{
          getKey: function(){return "thisone"}
        },{
          getKey: function(){return "notthisone"}
        }]}
      });

      pluginService.getPlugin = stub;
      pluginService.enablePluginModule("doesntmatter", "thisone");
      pluginService.disablePluginModule("doesntmatter", "thisone");

      expect(enableModuleSpy).to.have.been.calledOnce;
      expect(disableModuleSpy).to.have.been.calledOnce;
      enableModuleSpy.restore();
      disableModuleSpy.restore();
    });

});
