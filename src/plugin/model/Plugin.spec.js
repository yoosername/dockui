const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Plugin = require('./Plugin');

describe('Plugin', function() {
    "use strict";

    beforeEach(function(){
      
    });

    it('should be defined and loadable', function() {
      expect(Plugin).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(Plugin).to.be.a('function');
    });

    // Test getKey
    // Test getModules(filter)
    // Test getModule(moduleKey)
    // Test enable()
    // Test disable()
    // Test enableModule(moduleKey)
    // Test disableModule(moduleKey)

});
