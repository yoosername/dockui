const  {
    MissingStoreDuringSetupError,
    MissingEventServiceDuringSetupError,
    MissingAppServiceDuringSetupError,
    MissingWebServiceDuringSetupError
} = require("../constants/errors");

const  {
    APP_SERVICE_STARTED_EVENT,
    WEB_SERVICE_SHUTDOWN_EVENT,
    APP_SERVICE_SHUTDOWN_EVENT
} = require("../constants/events");

/**
 * @class DockUIApps
 * @description Wrapper around App services for easier usage
 * @constructor {DockUIAppsBuilder} builder
 * @method start - Starts framework
 * @throws DockuiFrameworkError
 */
class DockUIApps{

    constructor(builder){
        if(!builder){
            return new DockUIAppsBuilder();
        }

        this.appStore = builder.appStore;
        this.eventService = builder.eventService;
        this.appService = builder.appService;
        this.webService = builder.webService;
    }

    /**
     * @method start
     * @description initialize App service
     * @public
     */
    start(){
        this.appService.start();
        this.eventService.on(APP_SERVICE_STARTED_EVENT, () => {
            console.log("[DockUIApps] Framework has started, starting Web Service");
            this.webService.start();
        });
    }

    /**
     * @method shutdown
     * @description shutdown App service
     * @public
     */
    shutdown(){
        this.webService.shutdown();
        this.eventService.on(WEB_SERVICE_SHUTDOWN_EVENT, () => {
            console.log("[DockUIApps] Web system has shutdown successfully");
            this.appService.shutdown();
        });
        this.eventService.on(APP_SERVICE_SHUTDOWN_EVENT, () => {
            console.log("[DockUIApps] Framework has shutdown successfully");
        });
    }

}


/**
 * @class DockUIAppsBuilder
 * @description Builder that generates a DockUIApps instance
 */
class DockUIAppsBuilder{

    constructor(){
        this.appStore = null;
        this.eventService = null;
        this.appService=  null;
        this.webService = null;
    }

    /**
     * @method withStore 
     * @argument AppStore the AppStore to use
     */
    withStore(AppStore){
        this.appStore = AppStore;
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
     * @method withAppService 
     * @argument AppService the AppService to use
     */
    withAppService(AppService){
        this.appService = AppService;
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
     * @description Validate options and return a new DockUIApps instance
     */
    build(){
        this.validate();
        const dockUIApps = new DockUIApps(this);
        return dockUIApps;
    }

    /**
     * @method validate
     * @description Validate builder options
     */
    validate(){
        if(!this.appStore){
            throw new MissingStoreDuringSetupError();
        }
        if(!this.eventService){
            throw new MissingEventServiceDuringSetupError();
        }
        if(!this.appService){
            throw new MissingAppServiceDuringSetupError();
        }
        if(!this.webService){
            throw new MissingWebServiceDuringSetupError();
        }
    }

}

module.exports = {
    "DockUIApps" : DockUIApps,
    "DockUIAppsBuilder" : DockUIAppsBuilder,
    "MissingStoreDuringSetupError" : MissingStoreDuringSetupError,
    "MissingEventServiceDuringSetupError" : MissingEventServiceDuringSetupError,
    "MissingAppServiceDuringSetupError" : MissingAppServiceDuringSetupError,
    "MissingWebServiceDuringSetupError" : MissingWebServiceDuringSetupError
};