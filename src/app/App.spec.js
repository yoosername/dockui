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

        const app = new App(
          TEST_KEY,
          AppPermission.READ,
          mockAppDescriptor,
          mockAppLoader, 
          mockModuleLoaders,
          mockAppStore,
          mockEventService
        );

        app.modules = [
          {key:"m1"},{key:"m2"},{key:"m3"}
        ];
        expect(app.getModules().length).to.equal(3);
        expect(app.getModules((m)=>{return m.key==="m2";}).length).to.equal(1);

      });

      // Test getModule(moduleKey)
      it('should return correct single Module', function(){
        
        const stubDescriptor = sinon.stub(mockAppDescriptor, "getModules");
        const SINGLEKEY = "test.single.key";
        stubDescriptor.returns([
          {key:SINGLEKEY}
        ]);
        const stubCanLoad = sinon.stub(mockModuleLoaders[0], "canLoadModuleDescriptor");
        const stubLoad = sinon.stub(mockModuleLoaders[0], "loadModuleFromDescriptor");
        stubCanLoad.returns(true);
        stubLoad.returns({getKey:function(){return SINGLEKEY;}});

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
        expect(app.getModule(SINGLEKEY).getKey()).to.equal(SINGLEKEY);

        stubDescriptor.restore();
        stubCanLoad.restore();
        stubLoad.restore();

      });

      // Test enable()
      it('calling enable/disable should make isEnabled === true/false and cause relevant EVENT', function(){
        
        const eventSpy = sinon.spy(mockEventService, "emit");
        const app = new App(
          TEST_KEY,
          AppPermission.READ,
          mockAppDescriptor,
          mockAppLoader, 
          mockModuleLoaders,
          mockAppStore,
          mockEventService
        );

        expect(app.isEnabled()).to.equal(true);
        app.enable();
        expect(eventSpy.called).to.equal(true);
        eventSpy.reset();
        app.disable();
        expect(app.isEnabled()).to.equal(false);
        expect(eventSpy.called).to.equal(true);
        eventSpy.reset();
        

      });

      // Test enable()
      it('calling enable/disable should save state to store', function(){
        
        const storeSpy = sinon.spy(mockAppStore, "saveState");
        const app = new App(
          TEST_KEY,
          AppPermission.READ,
          mockAppDescriptor,
          mockAppLoader, 
          mockModuleLoaders,
          mockAppStore,
          mockEventService
        );

        app.enable();
        expect(storeSpy.called).to.equal(true);
        storeSpy.reset();
        

      });

  });
    
});