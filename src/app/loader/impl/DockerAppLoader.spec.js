const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const EventEmitter = require("events");

const  {
    MockAppStore,
    MockModuleLoaders,
    MockEventService
} = require("../../../util/mocks");

const  {
    DOCKER_APP_LOAD_REQUEST,
    DOCKER_APP_LOAD_STARTED,
    DOCKER_APP_LOAD_COMPLETE,
    DOCKER_APP_LOAD_FAILED,
    URL_APP_LOAD_REQUEST
} = require("../../../constants/events");

const generateHex = (length) => {
    "use strict";

    var ret = "";
    while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
};

const generateDate = () => {
    "use strict";

    var ret = "";
    while (ret.length < 10) {
        ret += Math.random().toString(10).substring(2);
    }
    return parseInt(ret.substring(0,10));
};

const generatePortBetween = (start,end) => {
    "use strict";
    return Math.floor(Math.random() * end) + start;
};

const generateMacAddress = () => {
    "use strict";
    return "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
        return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
    });
};

const generateContainer = () => {
    "use strict";
    return { 
        Id: `'${generateHex(64)}'`,
        Names: [ '/weary_lionel', 'suprised_morty' ],
        Image: 'alpine',
        ImageID: `'sha256:${generateHex(64)}'`,
        Command: 'top',
        Created: generateDate(),
        Ports: [{ IP: '0.0.0.0', PrivatePort: 80, PublicPort: generatePortBetween(30000,32000), Type: 'tcp' }],
        Labels: {},
        State: 'running',
        Status: 'Up 33 seconds',
        HostConfig: { NetworkMode: 'default' },
        NetworkSettings: { 
            Networks: { 
                bridge: { 
                    IPAMConfig: null,
                    Links: null,
                    Aliases: null,
                    NetworkID: `'${generateHex(64)}'`,
                    EndpointID: `'${generateHex(64)}'`,
                    Gateway: '172.17.0.1',
                    IPAddress: '172.17.0.2',
                    IPPrefixLen: 16,
                    IPv6Gateway: '',
                    GlobalIPv6Address: '',
                    GlobalIPv6PrefixLen: 0,
                    MacAddress: `'${generateMacAddress()}'`,
                    DriverOpts: null 
                } 
            } 
        },
        Mounts: [] 
    };
};

const generateContainers = (num) => {
    "use strict";

    var list = [];
    for(var n=0;n<num;n++){
        list.push(generateContainer());
    }
    return list;
};

var proxyquire =  require('proxyquire');
var dockerode0ContainersAtStartStub;
var dockerode5ContainersAtStartStub;
var DockerAppLoader;
var DockerAppLoaderWith5StartedContainers;
var docker0EventEmitter;
var docker5EventEmitter;

var mockAppStore = null;
var mockModuleLoaders = null;
var mockEventService = null;

describe('DockerAppLoader', function() {
    "use strict";

    beforeEach(function(){
        docker0EventEmitter = new EventEmitter();
        docker5EventEmitter = new EventEmitter();
        mockAppStore = new MockAppStore();
        mockModuleLoaders = new MockModuleLoaders();
        mockEventService = new MockEventService();
        dockerode0ContainersAtStartStub = sinon.stub()
        .returns({
            listContainers : (fn)=>{fn(null, []);},
            getEvents : (fn)=>{fn(null, docker0EventEmitter);}
        });
        dockerode5ContainersAtStartStub = sinon.stub()
        .returns({
            listContainers : (fn)=>{fn(null, generateContainers(5));},
            getEvents : (fn)=>{fn(null, docker5EventEmitter);}
        });
        DockerAppLoader = proxyquire('./DockerAppLoader',{
            'dockerode':dockerode0ContainersAtStartStub,
            'fs' : { 'statSync' : ()=>true }
        });
        DockerAppLoaderWith5StartedContainers = proxyquire('./DockerAppLoader',{
            'dockerode':dockerode5ContainersAtStartStub,
            'fs' : { 'statSync' : ()=>true }
        });
    });

    it('should be defined and loadable', function() {
        expect(DockerAppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(DockerAppLoader).to.be.a('function');
    });

    it('should attempt to start container when DOCKER_APP_LOAD_REQUEST detected', function(done) {
        const eventService = new EventEmitter();
        const singleContainer = generateContainer();
        const IMAGE = "dockui/unittest";
        singleContainer.Image = IMAGE;
        const customDockerodeStub = sinon.stub()
            .returns({
                listContainers : (fn)=>{fn(null, []);},
                run : (img,cmd,stream,fn)=>{
                    docker0EventEmitter.emit("start", singleContainer);
                    fn(null, null, singleContainer);
                },
                getEvents : (fn)=>{fn(null, docker0EventEmitter);}
            });
        DockerAppLoader = proxyquire('./DockerAppLoader',{
            'dockerode':customDockerodeStub,
            'fs' : { 'statSync' : ()=>true }
        });
        docker0EventEmitter.on("start", (container)=>{
            expect(container.Image).to.equal(IMAGE);
            done();
        });
        const dockerAppLoader = new DockerAppLoader(mockAppStore,mockModuleLoaders,eventService);
        dockerAppLoader.scanForNewApps();
        eventService.emit(DOCKER_APP_LOAD_REQUEST, {image : IMAGE});
    });

    it('should emit DOCKER_APP_LOAD_STARTED when container detected before processing', function(done) {
        const eventService = new EventEmitter();
        eventService.on(DOCKER_APP_LOAD_STARTED, ()=>{
            done();
        });
        const dockerAppLoader = new DockerAppLoader(mockAppStore,mockModuleLoaders,eventService);
        dockerAppLoader.scanForNewApps();
        docker0EventEmitter.emit("start", generateContainer());
    });

    it('should emit DOCKER_APP_LOAD_COMPLETE when everything is complete', function(done) {
        const eventService = new EventEmitter();
        eventService.on(DOCKER_APP_LOAD_COMPLETE, ()=>{
            done();
        });
        const dockerAppLoader = new DockerAppLoader(mockAppStore,mockModuleLoaders,eventService);
        dockerAppLoader.scanForNewApps();
        docker0EventEmitter.emit("start", generateContainer());
    });

    // TODO: These tests
    it('should emit DOCKER_APP_LOAD_FAILURE if a container is detected but it doesnt serve a reachable YAMl config', function() {
        
    });

    it('should emit URL_APP_LOAD_REQUESTED if Container is serving a reachable YAMl config', function() {
        
    });

    it('should initially detect all running containers when scanForNewApps is run', function(done) {
        const eventService = new EventEmitter();
        var count = 0;
        eventService.on(DOCKER_APP_LOAD_STARTED, ()=>{
            count++;
            if(count===5){
                done();
            }
        });
        const dockerAppLoader = new DockerAppLoaderWith5StartedContainers(mockAppStore,mockModuleLoaders,eventService);
        dockerAppLoader.isDockerRunning = () => true;
        dockerAppLoader.scanForNewApps();
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