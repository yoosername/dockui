const expect = require('chai').expect;
const DockerService = require("./DockerService");
const DockerClient = require("./MockDockerClient");
const EventEmitter = require("events");
const {
    MISSING_CLIENT_ERROR, 
    MISSING_EMITTER_ERROR,
    DOCKER_NOT_RUNNING_ERROR
} = require("../constants/errors");
const {CONTAINER_START_EVENT_ID,CONTAINER_STOP_EVENT_ID} = require("../constants/events");


describe('DockerService', function() {
    "use strict";

    it('should be defined and loadable', function() {
        expect(DockerService).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(DockerService).to.be.a('function');
    });

    it('should be able to be used with or without the new operator', function() {
        var withNewOperator = new DockerService(new DockerClient(), new EventEmitter());
        expect(withNewOperator).to.be.an.instanceOf(DockerService);

        var withoutNewOperator = new DockerService(new DockerClient(), new EventEmitter());
        expect(withoutNewOperator).to.be.an.instanceOf(DockerService);
    });

    it('should be called with an instance of DockerClient and an instance of EventEmitter or throw an error', function() {
        expect(function(){DockerService();}).to.throw(Error, MISSING_CLIENT_ERROR);
        expect(function(){DockerService(new DockerClient());}).to.throw(Error, MISSING_EMITTER_ERROR);
        expect(function(){DockerService(new DockerClient(), new EventEmitter());}).to.not.throw();
    });

    it(`should trigger ${CONTAINER_START_EVENT_ID} event for all containers detected on start`, function(done) {
        var emitter = new EventEmitter();
        var mockDockerClient = new DockerClient();
        var expectedContainerArray = mockDockerClient.containers;

        emitter.on(CONTAINER_START_EVENT_ID, function(payload){
            expect(payload).to.eql(expectedContainerArray[0]);
            done();
        });

        var ds = new DockerService(mockDockerClient,emitter);
        ds.start();
    });

    it('should throw an error if Docker is not running', function() {
        var emitter = new EventEmitter();
        var mockDockerClient = new DockerClient();
        mockDockerClient.setIsDockerRunning(false);
        var ds = new DockerService(mockDockerClient,emitter);

        expect(ds.isDockerRunning()).to.equal(false);
        expect(function(){ds.start();}).to.throw(Error, DOCKER_NOT_RUNNING_ERROR);

        mockDockerClient.setIsDockerRunning(true);

        expect(ds.isDockerRunning()).to.equal(true);
    });

    it(`should not fire ${CONTAINER_START_EVENT_ID} for existing containers on subsequent starts`, function() {
        var emitter = new EventEmitter();
        var count = 0;
        emitter.on(CONTAINER_START_EVENT_ID, function(){
            count++;
        });
        var EXPECTED_COUNT = 5;
        var mockDockerClient = new DockerClient(EXPECTED_COUNT);
        var ds = new DockerService(mockDockerClient,emitter);
        ds.start();
        expect(count).to.equal(EXPECTED_COUNT);
        ds.start();
        expect(count).to.equal(EXPECTED_COUNT);
        ds.start();
        expect(count).to.equal(EXPECTED_COUNT);
    });

    it(`should fire ${CONTAINER_START_EVENT_ID} when client detects new container`, function(done) {
        var emitter = new EventEmitter();
        var EXPECTED_COUNT = 5;
        var mockDockerClient = new DockerClient(EXPECTED_COUNT);
        var ds = new DockerService(mockDockerClient,emitter);
        var count = 0;

        emitter.on(CONTAINER_START_EVENT_ID, function(){
            count++;
        });

        ds.start();

        expect(count).to.equal(EXPECTED_COUNT);

        var container = mockDockerClient.generateNewContainer();

        emitter.on(CONTAINER_START_EVENT_ID, function(c){
            expect(count).to.equal(EXPECTED_COUNT + 1);
            expect(c).to.eql(container);
            done();
        });

        mockDockerClient.addRunningContainer(container);

    });

    it(`should fire ${CONTAINER_STOP_EVENT_ID} when client detects stopped container`, function(done) {
        var emitter = new EventEmitter();
        var EXPECTED_COUNT = 5;
        var mockDockerClient = new DockerClient(EXPECTED_COUNT);
        var ds = new DockerService(mockDockerClient,emitter);
        var count = 0;

        emitter.on(CONTAINER_START_EVENT_ID, function(){
            count++;
        });
        emitter.on(CONTAINER_STOP_EVENT_ID, function(){
            count--;
        });

        ds.start();

        expect(count).to.equal(EXPECTED_COUNT);

        var container = mockDockerClient.generateNewContainer();

        emitter.on(CONTAINER_START_EVENT_ID, function(c){
            expect(count).to.equal(EXPECTED_COUNT + 1);
        });

        emitter.on(CONTAINER_STOP_EVENT_ID, function(c){
            expect(count).to.equal(EXPECTED_COUNT);
            expect(c).to.eql(container);
            done();
        });

        mockDockerClient.addRunningContainer(container);
        mockDockerClient.stopContainer(container);

    });

});
