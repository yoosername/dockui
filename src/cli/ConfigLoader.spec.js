const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const ConfigLoader = require('./ConfigLoader');

describe('ConfigLoader', function() {
    "use strict";

    beforeEach(function(){
     
    });

    it('should be defined and loadable', function() {
      expect(ConfigLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(ConfigLoader).to.be.a('function');
    });

    it('should log a warning if you dont extend the default behaviour', function() {
      var logSpy = sinon.stub(console,"warn");
      const configLoader = new ConfigLoader();
      expect(configLoader.load).to.be.a('function');
      configLoader.load();
      expect(logSpy).to.be.called.callCount(1);
      logSpy.restore();
    });

});