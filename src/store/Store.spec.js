const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);



var Store = require('./Store');

describe('Store', function() {
    "use strict";

    beforeEach(function(){
      
    });

    it('should be defined and loadable', function() {
      expect(Store).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(Store).to.be.a('function');
    });

    // Tests get
    // Test Set
    // Test enablePlugin, disablePlugin
    // Test enablePluginModule, disablePluginModule

});
