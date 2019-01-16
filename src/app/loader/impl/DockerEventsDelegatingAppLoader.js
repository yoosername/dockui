const AppLoader = require("../AppLoader");
const Docker = require('dockerode');
const fs = require('fs');
const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const {DockerProblemListingContainersError} = require("../../../constants/errors");
  
  
  /**
   * @description Detect Docker containers and relevent service URLs
   *              Then delegate loading to UrlAppLoader via events
   */
  class DockerEventsDelegatingAppLoader extends AppLoader{
  
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

      return fs.statSync(DOCKER_SOCKET);
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
     * @description Handle what happens when a Container is started
     * @argument {object} container - the container that was started
     */
    handleContainerStart(container){
      if( !this.disabled && this.scanning ){
        // TODO: discover the URL of the container (private, network,service?)
        // Submit a framework event of APP_LOAD_REQUESTED with the URL
      }
    }

    /**
     * @description Handle what happens when a Container is stopped
     * @argument {object} container - the container that was stopped
     */
    handleContainerStop(container){
      if( !this.disabled && this.scanning ){
        // TODO: discover the URL of the container (private, network,service?)
        // Submit a framework event of APP_UNLOAD_REQUESTED with the URL
      }
    }
    
  
    /**
     * @description Stop checking for new Apps until scannig is enabled again.
     */
    stopScanningForNewApps(){
      this.scanning = false;
    }
  
  }
  
  module.exports = DockerEventsDelegatingAppLoader;