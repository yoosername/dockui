const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Module = require('./Module');

const  {
  MockApp,
  MockModuleDescriptor
} = require("../../util/mocks");

var mockApp = null;
var mockModuleDescriptor = null;

describe('Module', function() {
    "use strict";

    beforeEach(function(){
      mockApp = new MockApp();
      mockModuleDescriptor = new MockModuleDescriptor();
    });

    it('should be defined and loadable', function() {
      expect(Module).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(Module).to.be.a('function');
    });

    it('should validate arguments', function() {
      expect(function(){
        new Module();
      }).to.throw();
      expect(function(){
        new Module(null,null,null);
      }).to.throw();
      expect(function(){
        new Module(undefined,undefined,undefined);
      }).to.throw();
      expect(function(){
        new Module(mockApp,mockApp,"");
      }).to.throw();
      expect(function(){
        new Module(mockApp,mockModuleDescriptor);
      }).to.not.throw();
    });

    it('should respond with correct Key', function() {
      var MODULE_KEY = "mockModuleKey";
      var module = new Module(mockApp,mockModuleDescriptor);
      expect(module.getKey() === MODULE_KEY).to.equal(true);
    });

    it('should respond with correct Type', function() {
      var MODULE_TYPE = "mockModuleType";
      var module = new Module(mockApp,mockModuleDescriptor);
      expect(module.getType() === MODULE_TYPE).to.equal(true);
    });


});
