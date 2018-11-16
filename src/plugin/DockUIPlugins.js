const  {
    MissingStoreDuringSetupError,
    MissingEventServiceDuringSetupError,
    MissingPluginServiceDuringSetupError,
    MissingWebServiceDuringSetupError
} = require("../constants/errors");

const PLUGINSERVICE_START_COMPLETE_EVENT = "PLUGINSERVICE_START_COMPLETE_EVENT";
const PLUGINSERVICE_SHUTDOWN_COMPLETE_EVENT = "PLUGINSERVICE_SHUTDOWN_COMPLETE_EVENT";
const WEBSERVICE_SHUTDOWN_COMPLETE_EVENT = "WEBSERVICE_SHUTDOWN_COMPLETE_EVENT";
/**
 * @class DockUIPlugins
 * @description Wrapper around Plugin services for easier usage
 * @constructor {DockUIPluginsBuilder} builder
 * @method start - Starts framework
 * @throws DockuiFrameworkError
 */
class DockUIPlugins{

    constructor(builder){
        if(!builder){
            return new DockUIPluginsBuilder();
        }

        this.store = builder.store;
        this.eventService = builder.eventService;
        this.pluginService = builder.pluginService;
        this.webService = builder.webService;
    }

    /**
     * @method start
     * @description initialize plugin service
     * @public
     */
    start(){
        this.pluginService.start();
        this.eventService.on(PLUGINSERVICE_START_COMPLETE_EVENT, () => {
            console.log("[DockUIPlugins] Plugin system has started, starting Web Service");
            this.webService.start();
        });
    }

    /**
     * @method shutdown
     * @description shutdown plugin service
     * @public
     */
    shutdown(){
        this.webService.shutdown();
        this.eventService.on(WEBSERVICE_SHUTDOWN_COMPLETE_EVENT, () => {
            console.log("[DockUIPlugins] Web system has shutdown successfully");
            this.pluginService.shutdown();
        });
        this.eventService.on(PLUGINSERVICE_SHUTDOWN_COMPLETE_EVENT, () => {
            console.log("[DockUIPlugins] Plugin system has shutdown successfully");
        });
    }

}


/**
 * @class DockUIPluginsBuilder
 * @description Builder that generates a DockUIPlugins instance
 */
class DockUIPluginsBuilder{

    constructor(){
        this.store = null;
        this.eventService = null;
        this.pluginService=  null;
        this.webService = null;
    }

    /**
     * @method withStore 
     * @argument store the Store to use
     */
    withStore(store){
        this.store = store;
        return this;
    }

    /**
     * @method withEventService 
     * @argument eventService the EventService to use
     */
    withEventService(eventService){
        this.eventService = eventService;
        return this;
    }

    /**
     * @method withPluginService 
     * @argument pluginService the PluginService to use
     */
    withPluginService(pluginService){
        this.pluginService = pluginService;
        return this;
    }

    /**
     * @method withWebService
     * @argument webService the WebService to use
     */
    withWebService(webService){
        this.webService = webService;
        return this;
    }

    /**
     * @method build
     * @description Validate options and return a new DockUIPlugins instance
     */
    build(){
        this.validate();
        const dockUIPlugins = new DockUIPlugins(this);
        return dockUIPlugins;
    }

    /**
     * @method validate
     * @description Validate builder options
     */
    validate(){
        if(!this.store){
            throw new MissingStoreDuringSetupError();
        }
        if(!this.eventService){
            throw new MissingEventServiceDuringSetupError();
        }
        if(!this.pluginService){
            throw new MissingPluginServiceDuringSetupError();
        }
        if(!this.webService){
            throw new MissingWebServiceDuringSetupError();
        }
    }

}

module.exports = {
    "DockUIPlugins" : DockUIPlugins,
    "DockUIPluginsBuilder" : DockUIPluginsBuilder,
    "MissingStoreDuringSetupError" : MissingStoreDuringSetupError,
    "MissingEventServiceDuringSetupError" : MissingEventServiceDuringSetupError,
    "MissingPluginServiceDuringSetupError" : MissingPluginServiceDuringSetupError,
    "MissingWebServiceDuringSetupError" : MissingWebServiceDuringSetupError
};