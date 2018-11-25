const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var PluginModule = require('./PluginModule');

const  {
  MockPlugin,
  MockPluginModuleDescriptor
} = require("../../util/mocks");

var mockPlugin = null;
var mockPluginModuleDescriptor = null;

describe('PluginModule', function() {
    "use strict";

    beforeEach(function(){
      mockPlugin = new MockPlugin();
      mockPluginModuleDescriptor = new MockPluginModuleDescriptor();
    });

    it('should be defined and loadable', function() {
      expect(PluginModule).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(PluginModule).to.be.a('function');
    });

    it('should validate arguments', function() {
      expect(function(){
        new PluginModule();
      }).to.throw();
      expect(function(){
        new PluginModule(null,null,null);
      }).to.throw();
      expect(function(){
        new PluginModule(undefined,undefined,undefined);
      }).to.throw();
      expect(function(){
        new PluginModule(mockPlugin,mockPlugin,"");
      }).to.throw();
      expect(function(){
        new PluginModule(mockPlugin,mockPluginModuleDescriptor,"");
      }).to.not.throw();
    });

    it('should respond with correct Key', function() {
      var MODULE_KEY = "testModule";
      var module = new PluginModule(mockPlugin,mockPluginModuleDescriptor,MODULE_KEY);
      expect(module.getKey() === MODULE_KEY).to.equal(true);;
    });

    it('should respond with correct Type', function() {
      var MODULE_TYPE = "testModuleType";
      var descStub = sinon.stub(mockPluginModuleDescriptor,"getType");
      descStub.returns(MODULE_TYPE);
      var module = new PluginModule(mockPlugin,mockPluginModuleDescriptor,"test");
      expect(module.getType() === MODULE_TYPE).to.equal(true);
      descStub.restore();
    });

    it('should delegate enabling to the loader', function() {
      var MODULE_KEY = "testModule";
      var loaderStub = sinon.stub(mockPlugin,"getPluginLoader");
      loaderStub.returns({enablePluginModule:()=>{}});
      var module = new PluginModule(mockPlugin,mockPluginModuleDescriptor,MODULE_KEY);
      module.enable();
      expect(loaderStub).to.have.been.calledOnce;
      loaderStub.restore();
    });

    it('should delegate disabling to the loader', function() {
      var MODULE_KEY = "testModule";
      var loaderStub = sinon.stub(mockPlugin,"getPluginLoader");
      loaderStub.returns({disablePluginModule:()=>{}});
      var module = new PluginModule(mockPlugin,mockPluginModuleDescriptor,MODULE_KEY);
      module.disable();
      expect(loaderStub).to.have.been.calledOnce;
      loaderStub.restore();
    });

});
