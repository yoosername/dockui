const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var PluginLoader = require('./PluginLoader');

describe('PluginLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(PluginLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(PluginLoader).to.be.a('function');
    });

// Methods
// "scanForNewPlugins"
// "stopScanningForNewPlugins"
// "getPlugins",
// "enablePlugin"
// "disablePlugin"
// "getPluginModules"
// "enablePluginModule"
// "disablePluginModule"

});