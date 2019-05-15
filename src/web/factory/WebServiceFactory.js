/**
 * @description WebServiceFactory has a single method .create which generates
 *              an WebService instance based on passed in Config
 */
class WebServiceFactory {
  constructor() {}

  /**
   * @async
   * @description Return new WebService based on passed in config
   * @argument {Config} config The runtime config
   * @return {WebService} A instance of a WebService
   */
  create(config) {
    // TODO: Load the correct WebService implementation based on passed in Config
    // const webService = null;
    // switch( config.get("webService.type") ){
    //    case "" : webService = new SimpleWebService(config);
    //    case "management" : webService = new ManagementOnlyWebService(config);
    //    default : webService = new SimpleWebService(config);
    // }
    // return webService;
  }
}
let factory = factory ? factory : new WebServiceFactory();
module.exports = factory;
