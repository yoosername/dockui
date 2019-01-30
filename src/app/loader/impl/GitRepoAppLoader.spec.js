const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var GitRepoAppLoader = require('./GitRepoAppLoader');

describe('GitRepoAppLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(GitRepoAppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(GitRepoAppLoader).to.be.a('function');
    });

// TODO: These tests
// Methods to Test
// "scanForNewApps"
//   should detect GIT_REPO_REQUESTED event and attempt to clone the repo
//   Should submit a GIT_REPO_CLONE_STARTED event
//   Should submit a GIT_REPO_CLONE_COMPLETE event when finished
//   Should submit a GIT_REPO_CLONE_FAILED event if unsuccessful
// "stopScanningForNewApps"
//   should no longer detect GIT_REPO_REQUESTED events

});