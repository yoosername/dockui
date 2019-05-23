const SimpleAppService = require("../impl/SimpleAppService");
const { Config } = require("../../../config/Config");

/**
 * @description AppServiceFactory has a single method .create which generates
 *              an AppService instance based on passed in Config
 */
class AppServiceFactory {
  constructor() {}

  /**
   * @async
   * @description Return new WebService based on passed in config
   * @argument {TaskManager} taskManager Used by Appstore for tasking
   * @argument {AppStore} store Used by Appstore for rerieving persisted state
   * @argument {Config} config The runtime config
   * @return {AppService} A instance of a AppService
   */
  create({ taskManager, store, config = new Config() } = {}) {
    let appService = null;
    switch (config.get("appService.type")) {
      case "simple":
        appService = new SimpleAppService({ taskManager, store, config });
      default:
        appService = new SimpleAppService({ taskManager, store, config });
    }
    return appService;
  }
}
let factory;
factory = factory ? factory : new AppServiceFactory();
module.exports = factory;
