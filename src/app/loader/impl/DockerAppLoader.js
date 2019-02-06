const AppLoader = require("../AppLoader");
const Docker = require('dockerode');
const fs = require('fs');
const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const {DockerProblemListingContainersError} = require("../../../constants/errors");

const  {
  DOCKER_APP_LOAD_REQUEST,
  DOCKER_APP_LOAD_STARTED,
  DOCKER_APP_LOAD_COMPLETE,
  DOCKER_APP_LOAD_FAILED,
  URL_APP_LOAD_REQUEST
} = require("../../../constants/events");
  
  /**
   * @description An AppLoader which detects running Docker containers
   *              discovers the private service URL to the App descriptor
   *              then notifies the URLAppLoader to load the App
   */
  class DockerAppLoader extends AppLoader{
  
    /**
     * @argument {AppStore} appStore - The store to use for persistence.
     * @argument {Array} appModuleLoaders - The loaders to use for loading Modules.
     * @argument {EventService} eventService - The Event service.
     */
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
     * @description returns true if detects Docker via the socket
     * @returns {Boolean} True if Docker is detected as running
     */
    isDockerRunning(){
      "use strict";
      const running = fs.statSync(DOCKER_SOCKET);
      return running;
    }

    /** 
     * @description Adds a single Container to the local cache so we dont process it twice
     * @returns {Object} Container
     */
    addContainerToCache(container){
      "use strict";
      const id = container.Id;
      if(id){
        this.container_cache[id] = container;
        return true;
      }
      return false;
    }

    /** 
     * @description returns Containers that has the passed Id
     * @returns {Object} Container
     */
    getCachedContainer(id){
      "use strict";
      return this.container_cache[id] || null;
    }

    /**
     * @description Starting listening to Docker events for containers
     *              and any we dont yet know about when found attempt to load
     *              a descriptor. If there is one create App and enable
     *              all of the apps modules then
     *              Send App Load started Event
     *              
     */
    scanForNewApps(){
      
      // The first time we run do a one off scan for all running containers
      if((!this.scanning) && this.client){

        // var opts = {
        //   "status": "running"
        // };
        
        // First things first mark us as scanning
        this.scanning = true;
        
        this.client.listContainers((err, containers) => {

          if(err){
            return console.warn(DockerProblemListingContainersError);
          }

          containers.forEach((container) => {
            if( ! this.getCachedContainer(container.Id) ){
              this.handleContainerStart(container);
            }
          });

        });

        // Start listening for events from the framework
        //  - DOCKER_APP_LOAD_REQUEST means user requested to start a Docker container image via the CLI
        this.eventsService.on(DOCKER_APP_LOAD_REQUEST, ()=>{
          this.eventsService.emit(DOCKER_APP_LOAD_STARTED);
          // Use client to start image then end ( container client events will continue after started)
        });

        // Start listening for events from Docker to detect new Container starts
        this.client.getEvents((err, events) =>{

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
          
        });

      }

    }

    /**
     * @description Handle what happens when a Container is started
     * @argument {object} container - the container that was started
     */
    handleContainerStart(container){
      //console.log(container);
      if( this.scanning ){
        this.addContainerToCache(container);
        this.eventsService.emit(DOCKER_APP_LOAD_STARTED);
      }
    }

    /**
     * @description Handle what happens when a Container is stopped
     * @argument {object} container - the container that was stopped
     */
    handleContainerStop(container){
      if( this.scanning ){
        // Implement this.
      }
    }
    
  
    /**
     * @description Stop checking for new Apps until scannig is enabled again.
     */
    stopScanningForNewApps(){
      this.scanning = false;
    }
  
  }
  
  module.exports = DockerAppLoader;