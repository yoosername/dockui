const AppLoader = require("./AppLoader");
const  {
    validateShapes
} = require("../../util/validate");
  
  
  /**
   * @class DockerEventsAppLoader
   * @description Load Apps from App descriptors detected via Docker events subsystem
   * @argument {Object} dockerClient - The client used to interact with Docker
   * @argument {Array} appModuleLoaders - The loaders to use for loading Modules.
   * @argument {EventService} eventService - The Event service.
   */
  class DockerEventsAppLoader extends AppLoader{
  
    constructor(
      dockerClient,
      appModuleLoaders,
      eventService
    ){

      super(dockerClient,appModuleLoaders,eventService);

      // Validate our args using ducktyping utils. (figure out better way to do this later)
      validateShapes([
        {"shape":"DockerClient","object":dockerClient}
      ]);
  
      this.dockerClient = dockerClient;
  
    }
  
    /**
     * @method scanForNewApps
     * @description Starting checking some location for new Apps 
     *              and attempt to load them when found
     *              Loading them involves fetching AppDescriptor
     *              and creating a new App passing it in. The App will
     *              attempt to Load its own Modules and use Events for lifecycle.
     */
    scanForNewApps(){
      // Look in some location
      // When App detected
      // Try to load its descriptor
      // If successfully loaded try to create a App using the descriptor
    }
  
    /**
     * @method stopScanningForNewApps
     * @description Stop checking for new Apps until scan is called again.
     */
    stopScanningForNewApps(){
      // Implement this
    }
  
  }
  
  module.exports = DockerEventsAppLoader;