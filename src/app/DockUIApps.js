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
 * @description Wrapper around App services for easier usage
 */
class DockUIApps{

    /**
     * @argument {DockUIAppsBuilder} builder
     * @throws DockuiFrameworkError
     */
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
     * @description Initialize and start App service
     */
    start(){
        this.appService.start();
        this.eventService.on(APP_SERVICE_STARTED_EVENT, () => {
            console.log("[DockUIApps] Framework has started, starting Web Service");
            this.webService.start();
        });
    }

    /**
     * @description Shutdown App service
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
     * @description Use the specified AppStore
     * @argument {AppStore} appStore The AppStore to use
     */
    withStore(appStore){
        this.appStore = appStore;
        return this;
    }

    /**
     * @description Use the specified EventService
     * @argument {EventService} eventService The EventService to use
     */
    withEventService(eventService){
        this.eventService = eventService;
        return this;
    }

    /**
     * @description Use the specified AppService
     * @argument {AppService} appService The AppService to use
     */
    withAppService(appService){
        this.appService = appService;
        return this;
    }

    /**
     * @description Use the specified WebService
     * @argument {WebService} webService the WebService to use
     */
    withWebService(webService){
        this.webService = webService;
        return this;
    }

    /**
     * @description Validate options and return a new DockUIApps instance
     * @returns {DockUIApps} instance of DockUIApps
     */
    build(){
        this.validate();
        const dockUIApps = new DockUIApps(this);
        return dockUIApps;
    }

    /**
     * @description Validate builder options
     * @throws {MissingStoreDuringSetupError} MissingStoreDuringSetupError
     * @throws {MissingEventServiceDuringSetupError} MissingEventServiceDuringSetupError
     * @throws {MissingAppServiceDuringSetupError} MissingAppServiceDuringSetupError
     * @throws {MissingWebServiceDuringSetupError} MissingWebServiceDuringSetupError
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