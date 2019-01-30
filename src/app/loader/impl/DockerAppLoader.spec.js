const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var DockerAppLoader = require('./DockerAppLoader');

describe('DockerAppLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(DockerAppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(DockerAppLoader).to.be.a('function');
    });

    // TODO: These tests
    it('should emit DOCKER_APP_LOAD_STARTED when container detected before processing', function() {
        
    });

    it('should emit DOCKER_APP_LOAD_COMPLETE if it is detected as a real App', function() {
        
    });

    it('should emit DOCKER_APP_LOAD_FAILURE if a container is detected but it doesnt serve a descriptor', function() {
        
    });

    it('should emit URL_APP_LOAD_REQUESTED when new container detected, URL known and serving descriptor', function() {
        
    });

    it('should initially detect all running containers when scanForNewApps is run', function() {
        
    });

    it('should subsequently detect new containers individually until stopScanningForNewApps', function() {
        
    });

    it('should not detect new containers once stopScanningForNewApps is run', function() {
        
    });


//     it(`should trigger ${CONTAINER_START_EVENT_ID} event for all containers detected on start`, function(done) {
//         var emitter = new EventEmitter();
//         var mockDockerClient = new DockerClient();
//         var expectedContainerArray = mockDockerClient.containers;

//         emitter.on(CONTAINER_START_EVENT_ID, function(payload){
//             expect(payload).to.eql(expectedContainerArray[0]);
//             done();
//         });

//         var ds = new DockerService(mockDockerClient,emitter);
//         ds.start();
//     });

//     it('should throw an error if Docker is not running', function() {
//         var emitter = new EventEmitter();
//         var mockDockerClient = new DockerClient();
//         mockDockerClient.setIsDockerRunning(false);
//         var ds = new DockerService(mockDockerClient,emitter);

//         expect(ds.isDockerRunning()).to.equal(false);
//         expect(function(){ds.start();}).to.throw(Error, DOCKER_NOT_RUNNING_ERROR);

//         mockDockerClient.setIsDockerRunning(true);

//         expect(ds.isDockerRunning()).to.equal(true);
//         expect(function(){ds.start();}).to.not.throw;
        
//     });

//     it(`should not fire ${CONTAINER_START_EVENT_ID} for existing containers on subsequent starts`, function() {
//         var emitter = new EventEmitter();
//         var count = 0;
//         emitter.on(CONTAINER_START_EVENT_ID, function(){
//             count++;
//         });
//         var EXPECTED_COUNT = 5;
//         var mockDockerClient = new DockerClient(EXPECTED_COUNT);
//         var ds = new DockerService(mockDockerClient,emitter);
//         ds.start();
//         expect(count).to.equal(EXPECTED_COUNT);
//         ds.start();
//         expect(count).to.equal(EXPECTED_COUNT);
//         ds.start();
//         expect(count).to.equal(EXPECTED_COUNT);
//     });

//     it(`should fire ${CONTAINER_START_EVENT_ID} when client detects started container`, function(done) {
//         var emitter = new EventEmitter();
//         var EXPECTED_COUNT = 5;
//         var mockDockerClient = new DockerClient(EXPECTED_COUNT);
//         var ds = new DockerService(mockDockerClient,emitter);
//         var count = 0;

//         emitter.on(CONTAINER_START_EVENT_ID, function(){
//             count++;
//         });

//         ds.start();

//         expect(count).to.equal(EXPECTED_COUNT);

//         var container = mockDockerClient.generateNewContainer();

//         emitter.on(CONTAINER_START_EVENT_ID, function(c){
//             expect(count).to.equal(EXPECTED_COUNT + 1);
//             expect(c).to.eql(container);
//             done();
//         });

//         mockDockerClient.startContainer(container);

//     });

//     it(`should fire ${CONTAINER_STOP_EVENT_ID} when client detects stopped container`, function(done) {
//         var emitter = new EventEmitter();
//         var EXPECTED_COUNT = 5;
//         var mockDockerClient = new DockerClient(EXPECTED_COUNT);
//         var ds = new DockerService(mockDockerClient,emitter);
//         var count = 0;

//         emitter.on(CONTAINER_START_EVENT_ID, function(){
//             count++;
//         });
//         emitter.on(CONTAINER_STOP_EVENT_ID, function(){
//             count--;
//         });

//         ds.start();

//         expect(count).to.equal(EXPECTED_COUNT);

//         var container = mockDockerClient.generateNewContainer();

//         emitter.on(CONTAINER_START_EVENT_ID, function(){
//             expect(count).to.equal(EXPECTED_COUNT + 1);
//         });

//         emitter.on(CONTAINER_STOP_EVENT_ID, function(c){
//             expect(count).to.equal(EXPECTED_COUNT);
//             expect(c).to.eql(container);
//             done();
//         });

//         mockDockerClient.startContainer(container);
//         mockDockerClient.stopContainer(container);

//     });

//     it(`should stop firing events when stop() is called but refire only the difference when restarted again`, function() {
//         var emitter = new EventEmitter();
//         var START_COUNT = 5;
//         var mockDockerClient = new DockerClient(START_COUNT);
//         var ds = new DockerService(mockDockerClient,emitter);
//         var count = 0;

//         emitter.on(CONTAINER_START_EVENT_ID, function(){
//             count++;
//         });

//         var NEW_CONTAINER_BATCH_1 = [
//             mockDockerClient.generateNewContainer(),
//             mockDockerClient.generateNewContainer(),
//             mockDockerClient.generateNewContainer()
//         ];

//         var NEW_CONTAINER_BATCH_2 = [
//             mockDockerClient.generateNewContainer(),
//             mockDockerClient.generateNewContainer(),
//             mockDockerClient.generateNewContainer()
//         ];

//         ds.start();

//         NEW_CONTAINER_BATCH_1.forEach((container) =>{
//             mockDockerClient.startContainer(container);
//         });

//         expect(count).to.equal(START_COUNT + NEW_CONTAINER_BATCH_1.length);

//         ds.stop();

//         NEW_CONTAINER_BATCH_2.forEach((container) =>{
//             mockDockerClient.startContainer(container);
//         });

//         expect(count).to.equal(START_COUNT + NEW_CONTAINER_BATCH_1.length);

//         ds.start();

//         expect(count).to.equal(START_COUNT + NEW_CONTAINER_BATCH_1.length + NEW_CONTAINER_BATCH_2.length);

//     });

});