// const chai = require("chai");
// const expect = chai.expect;
// const sinon = require("sinon");
// const sinonChai = require('sinon-chai');
// chai.use(sinonChai);

// const nock = require("nock");

// const EventEmitter = require("events");
// const MockDockerClient = require("../docker/clients/MockDockerClient");
// const DockerService = require("../docker/DockerService");
// const PluginService = require("./PluginService");

// const { MISSING_EMITTER_ERROR } = require("../constants/errors");
// const { PLUGIN_DETECTED_EVENT_ID } = require("../constants/events");

// var EXAMPLE_PLUGIN_CONFIG_YAML_PATH = "/src/plugin/sample_plugin_config.yml";
// var EXAMPLE_PLUGIN_CONFIG_YAML;
// const yaml = require('js-yaml');
// const fs = require("fs");

// // Preload the example plugin yaml config
// try {
//     EXAMPLE_PLUGIN_CONFIG_YAML = yaml.safeLoad(fs.readFileSync(process.cwd() + EXAMPLE_PLUGIN_CONFIG_YAML_PATH, 'utf8'));
// } catch (e) {
//     console.log(e);
// }


// describe('PluginService', function() {
//     "use strict";

//     beforeEach(function(){
//         nock(/.*/)
//             .get('/dockui-plugin.yaml')
//             .reply(200, EXAMPLE_PLUGIN_CONFIG_YAML)
//             .persist();
//     });

//     it('should be defined and loadable', function() {
//         expect(PluginService).to.not.be.undefined;
//     });

//     it('should be a function', function() {
//         expect(PluginService).to.be.a('function');
//     });

//     it('should be called with an instance of EventEmitter or throw an error', function() {
//         expect(function(){PluginService();}).to.throw(Error, MISSING_EMITTER_ERROR);
//         expect(function(){PluginService(new EventEmitter());}).to.not.throw();
//     });

//     it('should be able to be used with or without the new operator', function() {
//         var events = new EventEmitter();

//         var withNewOperator = new PluginService(events);
//         expect(withNewOperator).to.be.an.instanceOf(PluginService);

//         var withoutNewOperator = PluginService(events);
//         expect(withoutNewOperator).to.be.an.instanceOf(PluginService);
//     });

//     // TODO: PluginService is responsible for:
//     //      discovering plugins,
//     //      reading config,
//     //      checking modules are ok,
//     //      keeping internal state of all plugins and modules, module specific config and state of plugin and modules
//     //      notifying via EventService when things change
//     //      reevaluating when plugins are removed, or modules no longer work

//     // TODO: should only action start and stop events on .start()

//     it('should detect docker container start and stop events', function() {
//         var CONTAINER_START_COUNT = 5;

//         var events = new EventEmitter();
//         var mockDockerClient = new MockDockerClient(CONTAINER_START_COUNT);
//         var dockerService = new DockerService(mockDockerClient,events);
//         var pluginService = new PluginService(events);

//         var spyStart = sinon.spy(pluginService, "handleContainerStartEvent");
//         var spyStop = sinon.spy(pluginService, "handleContainerStopEvent");

//         pluginService.start(); //pluginService first so its ready once docker events start rolling
//         dockerService.start();

//         expect(spyStart.callCount).to.equal(CONTAINER_START_COUNT);

//         var container1 = mockDockerClient.generateNewContainer();
//         var container2 = mockDockerClient.generateNewContainer();

//         mockDockerClient.startContainer(container1);
//         mockDockerClient.startContainer(container2);

//         expect(spyStart.callCount).to.equal(CONTAINER_START_COUNT + 2);

//         mockDockerClient.stopContainer(container1);
//         mockDockerClient.stopContainer(container2);

//         expect(spyStop.callCount).to.equal(2);
//     });

//     it('should emit plugin:detected event passing registration config when container:start detected', function(done){

//         var events = new EventEmitter();

//         events.on(PLUGIN_DETECTED_EVENT_ID, function(config){
//             expect(config).to.eql(EXAMPLE_PLUGIN_CONFIG_YAML);
//             done();
//         });

//         var mockDockerClient = new MockDockerClient(1);
//         var dockerService = new DockerService(mockDockerClient,events);
//         var pluginService = new PluginService(events);

//         pluginService.start();
//         dockerService.start();

//     });

//     it('should call registerPlugin(config) if receives valid registration config from container POST request', function(done){

//         var events = new EventEmitter();

//         var mockDockerClient = new MockDockerClient(1);
//         var dockerService = new DockerService(mockDockerClient,events);
//         var pluginService = new PluginService(events);

//         var spy = sinon.spy(pluginService, "registerPlugin");

//         events.on(PLUGIN_DETECTED_EVENT_ID, function(){
//             expect(spy.callCount).to.equal(1);
//             expect(spy.args[0]).to.eql([EXAMPLE_PLUGIN_CONFIG_YAML]);
//             done();
//         });

//         pluginService.start();
//         dockerService.start();

//     });

//     // TODO Tests
//     // TODO: Plugins should send requires sending valid JWT token with requests.
//     // TODO: If receives invalid or not found registration config from container POST request should warn about error

//     // TODO: should listen for plugin registration EVENT and check for key
//     // TODO: If registration successful should test declared modules
//     //          e.g. by trying to actually load them etc
//     // TODO: If any modules fail then put them in disabled state
//     // TODO: If all modules fail then put plugin in disabled state

//     // TODO: Also test that all valid yaml module types can be loaded with different valid args
//     // TODO: Test that invalid arguments or unknown types are handled correctly
//     // TODO: Test that badly formatted yaml or unknown file types are handled correctly

// });
