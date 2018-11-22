const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var PluginStore = require('./PluginStore');

describe('PluginStore', function() {
    "use strict";

    beforeEach(function(){
      
    });

    it('should be defined and loadable', function() {
      expect(PluginStore).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(PluginStore).to.be.a('function');
    });

    // Tests get
    // Test Set
    // Test enablePlugin, disablePlugin
    // Test enablePluginModule, disablePluginModule

});
