/**
 * @description AppServiceFactory has a single method .create which generates
 *              an AppService instance based on passed in Config
 */
class AppServiceFactory {
  constructor() {}

  /**
   * @async
   * @description Return new AppService based on passed in config
   * @argument {Config} config The runtime config
   * @return {AppService} A instance of a AppService
   */
  create(config) {
    // TODO: Load the correct AppService implementation based on passed in Config
    // const appService = null;
    // switch( config.get("appService.type") ){
    //    case "" : appService = new DefaultAppService(config);
    //    case "readOnly" : appService = new ReadOnlyAppService(config);
    //    default : appService = new DefaultAppService(config);
    // }
    // return appService;
  }
}
let factory = factory ? factory : new AppServiceFactory();
module.exports = factory;
