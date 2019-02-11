const proxyquire =  require('proxyquire');
const EventEmitter = require("events");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
    MockAppStore,
    MockModuleLoaders,
    MockEventService
} = require("../../../util/mocks");

const  {
    GIT_APP_LOAD_REQUEST,
    GIT_APP_LOAD_STARTED,
    GIT_APP_LOAD_COMPLETE,
    GIT_APP_LOAD_FAILED,
    URL_APP_LOAD_REQUEST
} = require("../../../constants/events");

var mockAppStore = null;
var mockModuleLoaders = null;
var mockEventService = null;
var nodeGitRepoURLRequested = null;
var nodeGitSuccessfulStub = null;
var nodeGitFailureStub = null;
const REJECTION_ERROR_MSG = "This git repo couldnt be loaded for some reason";

var GitAppLoader;
var GitFailingAppLoader;

describe('GitAppLoader', function() {
    "use strict";

    beforeEach(function(){
        mockAppStore = new MockAppStore();
        mockModuleLoaders = new MockModuleLoaders();
        mockEventService = new MockEventService();
        nodeGitRepoURLRequested = null;
        nodeGitSuccessfulStub = new sinon.stub()
        .returns({
            Clone: function(url) {
              nodeGitRepoURLRequested = url;
              return Promise.resolve(url);
            }
        })();
        nodeGitFailureStub = new sinon.stub()
        .returns({
            Clone: function() {
              nodeGitRepoURLRequested = null;
              return Promise.reject(new Error(REJECTION_ERROR_MSG));
            }
        })();
        GitAppLoader = proxyquire('./GitAppLoader',{
            'nodegit':nodeGitSuccessfulStub
        });
        GitFailingAppLoader = proxyquire('./GitAppLoader',{
            'nodegit':nodeGitFailureStub
        });
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
    //   should detect GIT_APP_LOAD_REQUEST event after scanForApps run
    it('should detect GIT_APP_LOAD_REQUEST events after scanForNewApps run', function() {
        const frameworkEvents = new EventEmitter();
        const gitRepo = "dockui/unittest";
        var gitAppLoader = new GitAppLoader(mockAppStore,mockModuleLoaders,frameworkEvents);
        gitAppLoader.scanForNewApps();
        frameworkEvents.emit(GIT_APP_LOAD_REQUEST, {repo : gitRepo});
        expect(gitAppLoader.scanning).to.equal(true);
        expect(nodeGitRepoURLRequested).to.equal(gitRepo);

        gitAppLoader = new GitFailingAppLoader(mockAppStore,mockModuleLoaders,frameworkEvents);
        gitAppLoader.scanForNewApps();
        frameworkEvents.emit(GIT_APP_LOAD_REQUEST, {repo : gitRepo});
        expect(gitAppLoader.scanning).to.equal(true);
        expect(nodeGitRepoURLRequested).to.equal(null);
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
        const frameworkEvents = new EventEmitter();
        const gitRepo = "dockui/unittest";
        var gitAppLoader = new GitAppLoader(mockAppStore,mockModuleLoaders,frameworkEvents);
        gitAppLoader.scanForNewApps();
        expect(gitAppLoader.scanning).to.equal(true);
        gitAppLoader.stopScanningForNewApps();
        frameworkEvents.emit(GIT_APP_LOAD_REQUEST, {repo : gitRepo});
        expect(gitAppLoader.scanning).to.equal(false);
        expect(nodeGitRepoURLRequested).to.equal(null);
    });

});