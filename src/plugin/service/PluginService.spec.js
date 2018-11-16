const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
  PLUGIN_SERVICE_STARTED_EVENT,
  PLUGIN_SERVICE_SHUTDOWN_EVENT,
  PLUGIN_LOADED_EVENT,
  PLUGIN_ENABLED_EVENT,
  PLUGIN_DISABLED_EVENT,
  PLUGIN_MODULE_ENABLED_EVENT,
  PLUGIN_MODULE_DISABLED_EVENT
} = require("../../constants/events");

const  {
  PluginServiceValidationError
} = require("../../constants/errors");

var PluginService = require('./PluginService');
var mockLoaders = null;
var mockStore = null;
var mockPluginEnableStrategy = null;
var mockEventService = null;

describe('PluginService', function() {
    "use strict";

    beforeEach(function(){
      mockLoaders = [
        { 
          scanForNewPlugins: function () {},
          stopScanningForNewPlugins: function () {},
          getPlugins: function(){},
          getPlugin: function (){},
          getPluginModules: function (){}
        }
      ];
      mockStore = { 
        get: function () {}, 
        set: function () {},
        enablePlugin: function(){},
        disablePlugin: function(){},
        enablePluginModule: function(){},
        disablePluginModule: function(){}
      };
      mockPluginEnableStrategy = {apply: function () {}};
      mockEventService = { on: function () {}, trigger: function () {} };
    });

    it('should be defined and loadable', function() {
      expect(PluginService).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(PluginService).to.be.a('function');
    });

    it('should validate arguments and throw if wrong', function() {
      expect(()=>{
        new PluginService(mockLoaders, mockStore, mockEventService);
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService(mockLoaders, mockEventService);
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService(mockStore);
      }).to.throw(PluginServiceValidationError);
      expect(()=>{
        new PluginService(mockLoaders, mockStore, mockPluginEnableStrategy, mockEventService);
      }).to.not.throw();
    });

    it('should run scanForNewPlugins and set _running to true on start', function() {
      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
        mockEventService
      );
      var mockService = sinon.mock(pluginService);
      mockService.expects("scanForNewPlugins").once();
      
      expect(pluginService._running).to.equal(false);
      pluginService.start();
      expect(pluginService._running).to.equal(true);

      mockService.verify();
    });

    it('should cause loaders to run scanForNewPlugins on start', function() {
      var pluginLoader = sinon.mock(mockLoaders[0]);
      pluginLoader.expects("scanForNewPlugins").once();
      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
        mockEventService
      );
      pluginService.start();
      pluginLoader.verify();
    });

    it('should add event listener on start for for plugin load events', function() {
      var events = sinon.mock(mockEventService);
      events.expects("on").once().calledWith(PLUGIN_LOADED_EVENT);
      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
        mockEventService
      );
      pluginService.start();
      events.verify();
    });

    it('should trigger events on start / shutdown', function() {
      var events = sinon.mock(mockEventService);
      events.expects("trigger").once().calledWith(PLUGIN_SERVICE_STARTED_EVENT);
      events.expects("trigger").once().calledWith(PLUGIN_SERVICE_SHUTDOWN_EVENT);
      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
        mockEventService
      );
      pluginService.start();
      pluginService.shutdown();
      events.verify();
    });

    it('should run stopScanningForNewPlugins and set _running to false on shutdown', function() {
      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
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
      var pluginLoader = sinon.mock(mockLoaders[0]);
      pluginLoader.expects("stopScanningForNewPlugins").once();
      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
        mockEventService
      );
      pluginService.shutdown();
      pluginLoader.verify();
    });

    it('should call loaders scanForNewPlugins on scanForNewPlugins', function() {
      var pluginLoader = sinon.mock(mockLoaders[0]);
      pluginLoader.expects("scanForNewPlugins").once();
      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
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
        mockStore, 
        mockPluginEnableStrategy, 
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
        mockStore, 
        mockPluginEnableStrategy, 
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
        mockStore, 
        mockPluginEnableStrategy, 
        mockEventService
      );
      pluginService.getPlugin();
      pluginLoader.verify();
    });

    it('should call enablePlugin and disablePlugin in store during enable/disable', function() { 
      var store = sinon.mock(mockStore);
      store.expects("enablePlugin").once();
      store.expects("disablePlugin").once();
      var events = sinon.mock(mockEventService);
      events.expects("trigger").once().withArgs(PLUGIN_ENABLED_EVENT);
      events.expects("trigger").once().withArgs(PLUGIN_DISABLED_EVENT);

      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
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
        mockStore, 
        mockPluginEnableStrategy, 
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
        mockStore, 
        mockPluginEnableStrategy, 
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
      var store = sinon.mock(mockStore);
      store.expects("enablePluginModule").once();
      store.expects("disablePluginModule").once();
      var events = sinon.mock(mockEventService);
      events.expects("trigger").once().withArgs(PLUGIN_MODULE_ENABLED_EVENT);
      events.expects("trigger").once().withArgs(PLUGIN_MODULE_DISABLED_EVENT);

      var pluginService = new PluginService(
        mockLoaders, 
        mockStore, 
        mockPluginEnableStrategy, 
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
      store.verify();
      events.verify();
    });

});
