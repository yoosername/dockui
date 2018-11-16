const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
  MissingStoreDuringSetupError,
  MissingEventServiceDuringSetupError,
  MissingPluginServiceDuringSetupError,
  MissingWebServiceDuringSetupError
} = require("../constants/errors");

var {DockUIPlugins, DockUIPluginsBuilder} = require('./DockUIPlugins');
var mockStore = null;
var mockPluginService = null;
var mockEventService = null;
var mockWebService = null;

describe('DockUIPlugins', function() {
    "use strict";

    beforeEach(function(){
      mockStore = { get: function () {}, set: function () {} };
      mockPluginService = { 
        start: function () {}, 
        shutdown: function () {},
        scanForNewPlugins: function () {},
        stopScanningForNewPlugins: function(){},
        getPlugins: function(){},
        getPlugin: function(){},
        enablePlugin: function(){},
        disablePlugin: function(){},
        getPluginModules: function(){},
        getPluginModule: function(){},
        enableModule: function(){},
        disableModule: function(){}
      };
      mockEventService = { on: function () {}, trigger: function () {} };
      mockWebService = { start: function () {}, shutdown: function () {} };
    });

    it('should be defined and loadable', function() {
      expect(DockUIPlugins).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(DockUIPlugins).to.be.a('function');
    });

    it('Should return a DockUIPlugins.Builder if one isnt passed as arg', function() {
      var builder = new DockUIPlugins();
      expect(builder).to.be.instanceof(DockUIPluginsBuilder);
    });

    it('should start pluginService.start method when start() called', function() {
      var pluginService = sinon.mock(mockPluginService);
      pluginService.expects("start").once();
      
      var dockUIPlugins = new DockUIPluginsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withPluginService(mockPluginService)
        .withWebService(mockWebService)
        .build();

      dockUIPlugins.start();
      pluginService.verify();

    });

    it('should call pluginService.stop method when stop() called', function() {
      var webService = sinon.mock(mockWebService);
      webService.expects("shutdown").once();
      
      var dockUIPlugins = new DockUIPluginsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withPluginService(mockPluginService)
        .withWebService(mockWebService)
        .build();

      dockUIPlugins.shutdown();
      webService.verify();

    });

});

describe('DockUIPluginsBuilder', function() {
  "use strict";

  it('should be able to set the Store', function() {
    new DockUIPluginsBuilder().withStore(mockStore);
  });

  it('should be able to set the EventService', function() {
    new DockUIPluginsBuilder().withEventService(mockEventService);
  });

  it('should be able to set the PluginService', function() {
    new DockUIPluginsBuilder().withPluginService(mockPluginService);
  });

  it('should be able to set the WebService', function() {
    new DockUIPluginsBuilder().withWebService(mockWebService);
  });

  it('should return a DockUIPlugins instance when build is called', function() {
    const dockuiPluginsInstance = new DockUIPluginsBuilder()
      .withStore(mockStore)
      .withEventService(mockEventService)
      .withPluginService(mockPluginService)
      .withWebService(mockWebService)
      .build();
    expect(dockuiPluginsInstance).to.be.an.instanceOf(DockUIPlugins);  
  });

  it('should validate when build is called', function() {
    expect(function(){
      new DockUIPluginsBuilder()
        .withEventService(mockEventService)
        .withPluginService(mockPluginService)
        .withWebService(mockWebService)
        .build();
    }).to.throw(MissingStoreDuringSetupError);  

    expect(function(){
      new DockUIPluginsBuilder()
        .withStore(mockStore)
        .withPluginService(mockPluginService)
        .withWebService(mockWebService)
        .build();
    }).to.throw(MissingEventServiceDuringSetupError);  

    expect(function(){
      new DockUIPluginsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withWebService(mockWebService)
        .build();
    }).to.throw(MissingPluginServiceDuringSetupError);  

    expect(function(){
      new DockUIPluginsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withPluginService(mockPluginService)
        .build();
    }).to.throw(MissingWebServiceDuringSetupError);  

  });

});
