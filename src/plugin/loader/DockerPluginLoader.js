const { CONTAINER_START_EVENT_ID, CONTAINER_STOP_EVENT_ID, PLUGIN_DETECTED_EVENT_ID } = require("../constants/events");
const { MISSING_EMITTER_ERROR, PLUGIN_SERVICE_NOT_RUNNING_ERROR } = require("../constants/errors");
const EventEmitter = require("events");
const request = require('superagent');
const YAML = require('js-yaml');

/**
 * PluginService
 * @description handles registration and deregistration of detected plugins and modules
 * @public
 * @constructor
 */
function PluginService(events) {
    "use strict";

    if (!(this instanceof PluginService)) {
      return new PluginService(events);
    }

    if(!events || !(events instanceof EventEmitter)){
      throw new Error(MISSING_EMITTER_ERROR);
    }

    this._events = events;
    this._running = false;
    this._initialised = false;

}

/**
 * PluginService.start
 * @description allow processing of new events
 * @public
 */
PluginService.prototype.start = function(){
  "use strict";

  if( this._initialised === false ){

    this._events
      .on(CONTAINER_START_EVENT_ID, (container) => {
        this.handleContainerStartEvent(container);
      })
      .on(CONTAINER_STOP_EVENT_ID, (container) => {
        this.handleContainerStopEvent(container);
      });

    this._initialised = true;

  }

  this._running = true;

};

/**
 * PluginService.stop
 * @description stop processing of new events
 * @public
 */
PluginService.prototype.stop = function(){
  "use strict";
  this._running = false;
};

/**
 * PluginService.handleContainerStartEvent
 * @description handle a Docker container start event
 * @public
 */
PluginService.prototype.handleContainerStartEvent = function(callback){
  "use strict";

  if( ! this._running ){
    console.warn(PLUGIN_SERVICE_NOT_RUNNING_ERROR);
    return;
  }

  request
  .get('http://localhost/dockui-plugin.yaml')
  .end((err, res) => {

    if(err) console.log(err);
    var config = this.loadYamlConfig(res.body);
    this.registerPlugin(config);

  });

};

/**
 * PluginService.loadYamlConfig
 * @description Load a Yaml string into JSON and return it
 * @public
 */
PluginService.prototype.loadYamlConfig = function(yaml){
  "use strict";

  // var config = {};
  // try {
  //   config = YAML.safeLoad(yaml);
  // } catch (e) {
  //   console.log(e);
  // }
  return yaml;

};

/**
 * PluginService.handleContainerStopEvent
 * @description handle a Docker container stop event
 * @public
 */
PluginService.prototype.handleContainerStopEvent = function(){
  "use strict";

  if( ! this._running ){
    console.warn(PLUGIN_SERVICE_NOT_RUNNING_ERROR);
    return;
  }

};

/**
 * PluginService.registerPlugin
 * @description register a plugin from its config
 * @public
 */
PluginService.prototype.registerPlugin = function(config){
  "use strict";

  // emit detected plugin
  this._events.emit(PLUGIN_DETECTED_EVENT_ID, config);
  // do some work
  // emit registered plugin

};


module.exports = PluginService;
