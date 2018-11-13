const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('DockUIPlugins', function() {
    "use strict";

    beforeEach(function(){
        //
    });

    it('should be defined and loadable', function() {
      var DockUIPlugins = require('./DockUIPlugins');
      expect(DockUIPlugins).to.not.be.undefined;
    });

    it('should be a function', function() {
      var {DockUIPlugins} = require('./DockUIPlugins');
      expect(DockUIPlugins).to.be.a('function');
    });

    it('Should return a DockUIPlugins.Builder if one isnt passed as arg', function() {
      var {DockUIPlugins, DockUIPluginsBuilder} = require('./DockUIPlugins');
      var builder = new DockUIPlugins();

      expect(builder).to.be.instanceof(DockUIPluginsBuilder);
    });

});

describe('DockUIPluginsBuilder', function() {
  "use strict";

  it('should be able to set the Store', function() {
    var DockUIPluginsBuilder = require('./DockUIPlugins').DockUIPluginsBuilder;
    var NoOpStore = require("../store/NoOpStore");
    new DockUIPluginsBuilder().withStore(new NoOpStore());
  });

  it('should be able to set the EventService', function() {
    var DockUIPluginsBuilder = require('./DockUIPlugins').DockUIPluginsBuilder;
    var emitter = require("events");
    new DockUIPluginsBuilder().withEventService(emitter);
  });

  it('should be able to set the PluginService', function() {
    var DockUIPluginsBuilder = require('./DockUIPlugins').DockUIPluginsBuilder;
    var NoOpPluginService = require("./service/PluginService");
    new DockUIPluginsBuilder().withPluginService(new NoOpPluginService());
  });

  it('should be able to set the WebService', function() {
    var DockUIPluginsBuilder = require('./DockUIPlugins').DockUIPluginsBuilder;
    var NoOpWebService = require("../web/NoOpWebService");
    new DockUIPluginsBuilder().withWebService(new NoOpWebService());
  });

  it('should return a DockUIPlugins instance when build is called', function() {
    var DockUIPlugins = require('./DockUIPlugins').DockUIPlugins;
    var DockUIPluginsBuilder = require('./DockUIPlugins').DockUIPluginsBuilder;
    var NoOpStore = require("../store/NoOpStore");
    var emitter = require("events");
    var NoOpPluginService = require("./service/PluginService");
    var NoOpWebService = require("../web/NoOpWebService");
    const dockuiPluginsInstance = new DockUIPluginsBuilder()
      .withStore(new NoOpStore())
      .withEventService(emitter)
      .withPluginService(new NoOpPluginService())
      .withWebService(new NoOpWebService())
      .build();
    expect(dockuiPluginsInstance).to.be.an.instanceOf(DockUIPlugins);  
  });

  it('should validate when build is called', function() {
    var DockUIPluginsBuilder = require('./DockUIPlugins').DockUIPluginsBuilder;
    var MissingStoreDuringSetupError = require('./DockUIPlugins').MissingStoreDuringSetupError;
    var MissingEventServiceDuringSetupError = require('./DockUIPlugins').MissingEventServiceDuringSetupError;
    var MissingPluginServiceDuringSetupError = require('./DockUIPlugins').MissingPluginServiceDuringSetupError;
    var MissingWebServiceDuringSetupError = require('./DockUIPlugins').MissingWebServiceDuringSetupError;
    var NoOpStore = require("../store/NoOpStore");
    var NoOpPluginService = require("./service/PluginService");
    var emitter = require("events");
    var NoOpWebService = require("../web/NoOpWebService");

    expect(function(){
      new DockUIPluginsBuilder()
        .withEventService(emitter)
        .withPluginService(new NoOpPluginService())
        .withWebService(new NoOpWebService())
        .build();
    }).to.throw(MissingStoreDuringSetupError);  

    expect(function(){
      new DockUIPluginsBuilder()
        .withStore(new NoOpStore())
        .withPluginService(new NoOpPluginService())
        .withWebService(new NoOpWebService())
        .build();
    }).to.throw(MissingEventServiceDuringSetupError);  

    expect(function(){
      new DockUIPluginsBuilder()
        .withStore(new NoOpStore())
        .withEventService(emitter)
        .withWebService(new NoOpWebService())
        .build();
    }).to.throw(MissingPluginServiceDuringSetupError);  

    expect(function(){
      new DockUIPluginsBuilder()
        .withStore(new NoOpStore())
        .withEventService(emitter)
        .withPluginService(new NoOpPluginService())
        .build();
    }).to.throw(MissingWebServiceDuringSetupError);  

  });

});
