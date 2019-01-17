const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
  MockAppStore,
  MockAppService,
  MockEventService,
  MockWebService
} = require("../util/mocks");

const  {
  MissingStoreDuringSetupError,
  MissingEventServiceDuringSetupError,
  MissingAppServiceDuringSetupError,
  MissingWebServiceDuringSetupError
} = require("../constants/errors");

var {DockUIApps, DockUIAppsBuilder} = require('./DockUIApps');

var mockStore = null;
var mockAppService = null;
var mockEventService = null;
var mockWebService = null;

describe('DockUIApps', function() {
    "use strict";

    beforeEach(function(){
      mockStore = new MockAppStore();
      mockAppService = new MockAppService();
      mockEventService = new MockEventService();
      mockWebService = new MockWebService();
    });

    it('should be defined and loadable', function() {
      expect(DockUIApps).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(DockUIApps).to.be.a('function');
    });

    it('Should return a DockUIApps.Builder if one isnt passed as arg', function() {
      var builder = new DockUIApps();
      expect(builder).to.be.instanceof(DockUIAppsBuilder);
    });

    it('should start AppService.start method when start() called', function() {
      var AppService = sinon.mock(mockAppService);
      AppService.expects("start").once();
      
      var dockUIApps = new DockUIAppsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withAppService(mockAppService)
        .withWebService(mockWebService)
        .build();

      dockUIApps.start();
      AppService.verify();

    });

    it('should call WebService.stop method when stop() called', function() {
      var webService = sinon.mock(mockWebService);
      webService.expects("shutdown").once();
      
      var dockUIApps = new DockUIAppsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withAppService(mockAppService)
        .withWebService(mockWebService)
        .build();

      dockUIApps.shutdown();
      webService.verify();

    });

});

describe('DockUIAppsBuilder', function() {
  "use strict";

  it('should be able to set the Store', function() {
    new DockUIAppsBuilder().withStore(mockStore);
  });

  it('should be able to set the EventService', function() {
    new DockUIAppsBuilder().withEventService(mockEventService);
  });

  it('should be able to set the AppService', function() {
    new DockUIAppsBuilder().withAppService(mockAppService);
  });

  it('should be able to set the WebService', function() {
    new DockUIAppsBuilder().withWebService(mockWebService);
  });

  it('should return a DockUIApps instance when build is called', function() {
    const dockuiAppsInstance = new DockUIAppsBuilder()
      .withStore(mockStore)
      .withEventService(mockEventService)
      .withAppService(mockAppService)
      .withWebService(mockWebService)
      .build();
    expect(dockuiAppsInstance).to.be.an.instanceOf(DockUIApps);  
  });

  it('should validate when build is called', function() {
    expect(function(){
      new DockUIAppsBuilder()
        .withEventService(mockEventService)
        .withAppService(mockAppService)
        .withWebService(mockWebService)
        .build();
    }).to.throw(MissingStoreDuringSetupError);  

    expect(function(){
      new DockUIAppsBuilder()
        .withStore(mockStore)
        .withAppService(mockAppService)
        .withWebService(mockWebService)
        .build();
    }).to.throw(MissingEventServiceDuringSetupError);  

    expect(function(){
      new DockUIAppsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withWebService(mockWebService)
        .build();
    }).to.throw(MissingAppServiceDuringSetupError);  

    expect(function(){
      new DockUIAppsBuilder()
        .withStore(mockStore)
        .withEventService(mockEventService)
        .withAppService(mockAppService)
        .build();
    }).to.throw(MissingWebServiceDuringSetupError);  

  });

});
