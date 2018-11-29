const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var AppModule = require('./AppModule');

const  {
  MockApp,
  MockAppModuleDescriptor
} = require("../../util/mocks");

var mockApp = null;
var mockAppModuleDescriptor = null;

describe('AppModule', function() {
    "use strict";

    beforeEach(function(){
      mockApp = new MockApp();
      mockAppModuleDescriptor = new MockAppModuleDescriptor();
    });

    it('should be defined and loadable', function() {
      expect(AppModule).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(AppModule).to.be.a('function');
    });

    it('should validate arguments', function() {
      expect(function(){
        new AppModule();
      }).to.throw();
      expect(function(){
        new AppModule(null,null,null);
      }).to.throw();
      expect(function(){
        new AppModule(undefined,undefined,undefined);
      }).to.throw();
      expect(function(){
        new AppModule(mockApp,mockApp,"");
      }).to.throw();
      expect(function(){
        new AppModule(mockApp,mockAppModuleDescriptor,"");
      }).to.not.throw();
    });

    it('should respond with correct Key', function() {
      var MODULE_KEY = "testModule";
      var module = new AppModule(mockApp,mockAppModuleDescriptor,MODULE_KEY);
      expect(module.getKey() === MODULE_KEY).to.equal(true);
    });

    it('should respond with correct Type', function() {
      var MODULE_TYPE = "testModuleType";
      var descStub = sinon.stub(mockAppModuleDescriptor,"getType");
      descStub.returns(MODULE_TYPE);
      var module = new AppModule(mockApp,mockAppModuleDescriptor,"test");
      expect(module.getType() === MODULE_TYPE).to.equal(true);
      descStub.restore();
    });

    it('should delegate enabling to the loader', function() {
      var MODULE_KEY = "testModule";
      var loaderStub = sinon.stub(mockApp,"getAppLoader");
      loaderStub.returns({enableAppModule:()=>{}});
      var module = new AppModule(mockApp,mockAppModuleDescriptor,MODULE_KEY);
      module.enable();
      expect(loaderStub).to.have.been.calledOnce;
      loaderStub.restore();
    });

    it('should delegate disabling to the loader', function() {
      var MODULE_KEY = "testModule";
      var loaderStub = sinon.stub(mockApp,"getAppLoader");
      loaderStub.returns({disableAppModule:()=>{}});
      var module = new AppModule(mockApp,mockAppModuleDescriptor,MODULE_KEY);
      module.disable();
      expect(loaderStub).to.have.been.calledOnce;
      loaderStub.restore();
    });

});
