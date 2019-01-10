const AppLoader = require("./AppLoader");

const  {
  APP_UNLOAD_STARTING_EVENT,
  APP_UNLOAD_COMPLETE_EVENT,
  APP_UNLOAD_FAILED_EVENT,
} = require("../../constants/events");

const Docker = require('dockerode');
const fs = require('fs');
const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const {DockerProblemListingContainersError} = require("../../constants/errors");
  
  
  /**
   * @class DockerEventsAppLoader
   * @description Load Apps from App descriptors detected via Docker events subsystem
   * @argument {AppStore} appStore - The store to use for persistence.
   * @argument {Array} appModuleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  class DockerEventsAppLoader extends AppLoader{
  
    constructor(
      appStore,
      appModuleLoaders,
      eventService
    ){

      super(appStore,appModuleLoaders,eventService);

      if(this.isDockerRunning()){
        this.client = new Docker({ socketPath: DOCKER_SOCKET });
      }else{
        this.client = null;
        this.disabled = true;
      }

      this.initialised = false;
      this.scanning = false;
      this.container_cache = {};

    }
  
    /** 
     * @method isDockerRunning
     * @description returns true if detects Docker via the socket
     * @public
     */
    isDockerRunning(){
      "use strict";

      return fs.statSync(DOCKER_SOCKET);
    }

    /**
     * @method scanForNewApps
     * @description Starting listening to Docker events for containers
     *              and any we dont yet know about when found attempt to load
     *              a descriptor. If there is one create App and enable
     *              all of the apps modules then
     *              Send App Load started Event
     *              
     */
    scanForNewApps(){
      
      if(!this.disabled && !this.scanning){

        this.client.listRunningContainers({all: true}, (err, containers) => {

          if(err){
            return console.warn(DockerProblemListingContainersError);
          }

          containers.forEach((container) => {

            if( ! this.container_cache.includes(container) ){
              this.handleContainerStart(container);
            }
            
          });

        });

      }

      // The first time we run - hook up some event listeners for container events
      if( !this.disabled && !this.initialised ){

        // Start listening for events from the client
        this._client.getEvents((err, events) =>{

          if(err){
            return console.warn("Error getting Docker client events");
          }

          events
            .on("start", (container) => {
              this.handleContainerStart(container);
            })
            .on("stop", (container) => {
              this.handleContainerStop(container);
            });

          this.initialised = true;
          this.scanning = true;
          
        });

      }

    }

    /**
     * @method handleContainerStart
     * @argument {object} container - the container that was started
     * @description Handle what happens when a Container is started
     */
    handleContainerStart(container){
      if( !this.disabled && this.scanning ){
        // TODO: Add the Module Loader functionalty here.
        // Try to load descriptor ( from well defined location specific to loader )
        // If there is one then
          // Send App Load starting Event
          // this.eventService.emit(APP_LOAD_STARTING_EVENT, app);
          // Parse descriptor (overwrite descriptor base url to detected public docker one)
          // Try to create App() using the parsed JSON Descriptor
          // If fail send App load failed event
          // Add the App to our Cache.
          // enable all of this Apps modules.
          // Send App Load Complete Event
          // this.eventService.emit(APP_LOAD_COMPLETE_EVENT, app);
      }
    }

    /**
     * @method handleContainerStop
     * @argument {object} container - the container that was stopped
     * @description Handle what happens when a Container is stopped
     */
    handleContainerStop(container){
      if( !this.disabled && this.scanning ){
        const app = this.container_cache[container.Id];
        if(app){
          this.eventService.emit(APP_UNLOAD_STARTING_EVENT, app);
          try{
            app.getAppModules().forEach(module=>{
              module.disable();
            });
          }catch(e){
            return this.eventService.emit(APP_UNLOAD_FAILED_EVENT, e);
          }
          this.eventService.emit(APP_UNLOAD_COMPLETE_EVENT, app);
        }
      }
    }
    
  
    /**
     * @method stopScanningForNewApps
     * @description Stop checking for new Apps until scannig is enabled again.
     */
    stopScanningForNewApps(){
      this.scanning = false;
    }
  
  }
  
  module.exports = DockerEventsAppLoader;