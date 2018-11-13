/**
 * DockUIPlugins
 * Wrapper around Plugin services for easier usage
 * @constructor {DockUIPlugins.Builder} builder
 * @static DockUIPlugins.Builder
 * @method start - Starts framework
 * @throws DockuiFrameworkError
 */
class DockUIPlugins{

    constructor(builder){
        if(!builder){
            return new DockUIPluginsBuilder();
        }
    }

}

class MissingStoreDuringSetupError extends Error{}
class MissingEventServiceDuringSetupError extends Error{}
class MissingPluginServiceDuringSetupError extends Error{}
class MissingWebServiceDuringSetupError extends Error{}


class DockUIPluginsBuilder{

    constructor(){
        this.store = null;
        this.eventService = null;
        this.pluginService=  null;
        this.webService = null;
    }

    withStore(store){
        this.store = store;
        return this;
    }

    withEventService(eventService){
        this.eventService = eventService;
        return this;
    }

    withPluginService(pluginService){
        this.pluginService = pluginService;
        return this;
    }

    withWebService(webService){
        this.webService = webService;
        return this;
    }

    build(){
        this.validate();
        const dockUIPlugins = new DockUIPlugins(this);
        return dockUIPlugins;
    }

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

 /**
 * DockUIPlugins.Builder
 * @method withStore
 * @method withEventService
 * @method withPluginService
 * @method withWebService
 * @method build - Returns new DockUIPlugins
 */

module.exports = {
    "DockUIPlugins" : DockUIPlugins,
    "DockUIPluginsBuilder" : DockUIPluginsBuilder,
    "MissingStoreDuringSetupError" : MissingStoreDuringSetupError,
    "MissingEventServiceDuringSetupError" : MissingEventServiceDuringSetupError,
    "MissingPluginServiceDuringSetupError" : MissingPluginServiceDuringSetupError,
    "MissingWebServiceDuringSetupError" : MissingWebServiceDuringSetupError
};