const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const uuidv4 = require('uuid/v4');

const AppPermission = require("./permission/AppPermission");

const  {
  MockAppStore,
  MockAppDescriptor,
  MockAppLoader,
  MockModuleLoaders,
  MockEventService
} = require("../util/mocks");

var App = require('./App');

var mockAppStore = null;
var mockAppStore2 = null;
var mockAppStoreGetState = null;
var mockAppStore2GetState = null;
var mockAppLoader = null;
var mockAppDescriptor = null;
var mockModuleLoaders = null;
var mockEventService = null;

const TEST_KEY = "test.key";
const TEST_UUID = uuidv4();
const TEST_UUID2 = uuidv4();
const TEST_STATE = {
  key : TEST_KEY,
  uuid: TEST_UUID,
  enabled: true
};
const TEST_STATE2 = {
  key : TEST_KEY,
  uuid: TEST_UUID2,
  enabled: false
};

describe('App', function() {
    "use strict";

    beforeEach(function(){
      mockAppStore = new MockAppStore();
      mockAppStore2 = new MockAppStore();
      mockAppStoreGetState = sinon.stub(mockAppStore, "getState");
      mockAppStoreGetState.returns(TEST_STATE);
      mockAppStore2GetState = sinon.stub(mockAppStore2, "getState");
      mockAppStore2GetState.returns(TEST_STATE2);
      mockAppLoader = new MockAppLoader();
      mockAppDescriptor = new MockAppDescriptor();
      mockModuleLoaders = new MockModuleLoaders();
      mockEventService = new MockEventService();
    });

    afterEach(function(){
      mockAppStoreGetState.restore();
      mockAppStore2GetState.restore();
    });

    it('should be defined and loadable', function() {
      expect(App).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(App).to.be.a('function');
    });

    // TODO: These tests
    // App should validate arguments
    it('should validate arguments or throw', function() {
      expect(()=>{new App();}).to.throw();
      expect(()=>{new App("","","","","","","");}).to.throw();
      expect(()=>{new App({},{},{},{},{},{},{});}).to.throw();
      expect(()=>{new App(null,null,null,null,null,null,null);}).to.throw();
      expect(()=>{new App(undefined,undefined,undefined,undefined,undefined,undefined,undefined);}).to.throw();
      expect(()=>{new App(
        TEST_KEY,
        AppPermission.READ,
        mockAppDescriptor,
        mockAppLoader, 
        mockModuleLoaders,
        mockAppStore,
        mockEventService
      );}).to.not.throw();
    });

    describe('Methods', function(){

      var mockApp;
      var mockApp2;

      beforeEach(function(){
        const generateApp = (store)=>{
          return new App(
            TEST_KEY,
            AppPermission.READ,
            mockAppDescriptor,
            mockAppLoader, 
            mockModuleLoaders,
            store,
            mockEventService
          );
        };
        mockApp = generateApp(mockAppStore);
        mockApp2 = generateApp(mockAppStore2);
      });

      it('getKey should return correct key', function(){
        expect(mockApp.getKey()).to.equal(TEST_KEY);
      });

      it('2 instances with the same key should have different UUIDs', function(){
        expect(mockApp.getKey()).to.equal(mockApp2.getKey());
        expect(mockApp.getUUID()).to.not.equal(mockApp2.getUUID());
      });

      // Test App should reuse its UUID from store if already exists
      it('should reuse UUID pulled from store if there is one', function(){
        
        const app = new App(
          TEST_KEY,
          AppPermission.READ,
          mockAppDescriptor,
          mockAppLoader, 
          mockModuleLoaders,
          mockAppStore,
          mockEventService
        );

        expect(mockAppStoreGetState.called).to.equal(true);
        expect(app.getUUID()).to.equal(TEST_UUID);

      });

    // Test getModules(filter)
    it('should return filtered Array of modules via getModules', function(){
      const stubDescriptor = sinon.stub(mockAppDescriptor, "getModules");
      stubDescriptor.returns([
        {key:"m1"},{key:"m2"},{key:"m3"}
      ]);
      const stubCanLoad = sinon.stub(mockModuleLoaders[0], "canLoadModuleDescriptor");
      stubCanLoad.returns(true);
      const stubLoad = sinon.stub(mockModuleLoaders[0], "loadModuleFromDescriptor");
      var count = 0;
      stubLoad.returns({key:""+ (count++) +""});

      const app = new App(
        TEST_KEY,
        AppPermission.READ,
        mockAppDescriptor,
        mockAppLoader, 
        mockModuleLoaders,
        mockAppStore,
        mockEventService
      );

      expect(app.getModules().length).to.equal(3);
      app.modules = [
        {key:"m1"},{key:"m2"},{key:"m3"}
      ];
      expect(app.getModules((m)=>{return m.key==="m2";}).length).to.equal(1);

      stubDescriptor.restore();
      stubCanLoad.restore();
      stubLoad.restore();
    });

    // Test getModule(moduleKey)
    // Test enable()
    // Test disable()
    });
    

});
