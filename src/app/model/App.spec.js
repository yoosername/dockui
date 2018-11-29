const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var App = require('./App');

describe('App', function() {
    "use strict";

    beforeEach(function(){
      
    });

    it('should be defined and loadable', function() {
      expect(App).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(App).to.be.a('function');
    });

    // Test getKey
    // Test getModules(filter)
    // Test getModule(moduleKey)
    // Test enable()
    // Test disable()
    // Test enableModule(moduleKey)
    // Test disableModule(moduleKey)

});
