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

const exists = (thing)=>{
  "use strict";
  try{
    var it = thing;
    return true;
  }catch(e){
    return false;
  }
};

const getContainerPublicAppURL = (container)=>{
  "use strict";
  if(exists(container.Ports[0].PublicPort)){
    return `http://localhost:${container.Ports[0].PublicPort}/dockui.app.yml`;
  }
  return null;
};

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
    }

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
   * @description returns cached container. If doesnt exist sets it first
   * @param {Object} container The Container to look for or set in the cache
   * @returns {Object} Container
   */
  getOrSetCachedContainer(container){
    "use strict";
    if(container && container.Id){
      if( ! this.container_cache[container.Id] ){
        this.container_cache[container.Id] = container;
      }
      return this.container_cache[container.Id];
    }
    return container;
  }

  /** 
   * @description Remove a single Container from the cache
   * @returns {Object} Container
   */
  deleteCachedContainer(container){
    "use strict";
    var cached = this.getCachedContainer(container);
    if(cached){
      delete this.container_cache[container.Id];
      return cached;
    }
    return container;
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
      
      // Take a look at what if any containers are already running
      this.client.listContainers((err, containers) => {

        if(err){
          return console.warn(DockerProblemListingContainersError);
        }
        
        containers.forEach((container) => {
          this.handleContainerStart(container);
        });

      });

      // Start listening for events from the framework
      //  - DOCKER_APP_LOAD_REQUEST means user requested to start a Docker container image via the CLI
      this.eventsService.on(DOCKER_APP_LOAD_REQUEST, (request)=>{
        const image = request.image;
        const cmd = request.cmd || [];
        // Use client to start image then end ( container client events will continue after started)
        this.client.run(image, cmd, process.stdout, function (err, data, container) {
          if(err) console.warn("Error running Docker image: ",image," with cmd: ",cmd);
        });
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

    // Only act at all if we are current set to scanning
    if( this.scanning ){

      
      // Get the cached version of the container
      var cached = this.getOrSetCachedContainer(container);
      var completeResponse = {container : cached};

      // If we have already Tested for config and submitted URL Load request then nothing to do
      if(cached.requested !== true && cached.isAnApp !== false){
        
        // Tell the system we has started processing a new Container
        this.eventsService.emit(DOCKER_APP_LOAD_STARTED,{
          status : "loading",
          message : "A Container with ID (" +cached.Id+") has started and not previously requested, checking if it serves an App config",
          container : container
        });

        // Check if the Container is actually an App
        const appUrl = getContainerPublicAppURL(cached);

        // If it is then Yey, use the URL to emit a URL Load Request and cache thast weve requested it
        if(appUrl){

          // Request a URL App Load
          this.eventsService.emit(URL_APP_LOAD_REQUEST,{
            origin : "DockerAppLoader:Container(id:"+cached.Id+")",
            url : appUrl
          });

          // Cache the fact we loaded this container already
          cached.requested = true;

          // Notify Completed successfully
          completeResponse.status = "success";
          completeResponse.msg = "A Container[id:" +cached.Id+",url:"+appUrl+"] has been processed and a URL request made";
          

        }else{
          cached.isAnApp = false;
          completeResponse.status = "success";
          completeResponse.msg = "A Container with ID (" +cached.Id+") was detected but not an App so skipping";
        }

        // Tell the system we have successfully loaded a new Container
        this.eventsService.emit(DOCKER_APP_LOAD_COMPLETE, completeResponse);

      }

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