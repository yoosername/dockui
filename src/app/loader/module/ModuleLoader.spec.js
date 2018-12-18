const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var ModuleLoader = require('./ModuleLoader');

describe('ModuleLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(ModuleLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(ModuleLoader).to.be.a('function');
        expect(()=>{new ModuleLoader();}).not.to.throw();
        expect(new ModuleLoader()).to.be.an.instanceOf(ModuleLoader);
    });

    it('should log a warning if you dont extend the default behaviour', function() {
        var logSpy = sinon.stub(console,"warn");
        const loader = new ModuleLoader();
        expect(loader.canLoadModuleDescriptor).to.be.a('function');
        expect(loader.loadModuleFromDescriptor).to.be.a('function');
        loader.canLoadModuleDescriptor();
        expect(logSpy).to.be.called.callCount(1);
        loader.loadModuleFromDescriptor();
        expect(logSpy).to.be.called.callCount(2);
        logSpy.restore();
    });

});