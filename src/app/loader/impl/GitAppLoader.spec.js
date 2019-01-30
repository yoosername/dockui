const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var GitAppLoader = require('./GitAppLoader');

describe('GitAppLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(GitAppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(GitAppLoader).to.be.a('function');
    });

    // TODO: These tests
    // Methods to Test
    // "scanForNewApps"
    //   should detect GIT_CLONE_REQUESTED event after scanForApps run
    it('should detect GIT_CLONE_REQUESTED events after scanForNewApps run', function() {
        
    });

    //   Should submit a GIT_CLONE_STARTED event
    it('should submit a GIT_CLONE_STARTED event upon detection of GIT_CLONE_REQUESTED', function() {
        
    });

    //   Should submit a GIT_CLONE_COMPLETE event when finished
    it('should submit a GIT_CLONE_COMPLETE event upon completion of clone', function() {
        
    });

    //   Should submit a GIT_CLONE_FAILED event if unsuccessful
    it('should submit a GIT_CLONE_FAILED event upon failure', function() {
        
    });

    //   Should attempt to clone the repo to temporary file cache
    // Use proxyquire on git module
    it('Should attempt to clone the repo to temporary file cache', function() {
        
    });

    // "stopScanningForNewApps"
    //   should no longer detect GIT_CLONE_REQUESTED events
    it('should no longer detect GIT_CLONE_REQUESTED events after stopScanningForNewApps run', function() {
        
    });

});