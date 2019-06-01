const SimpleAppService = require("../impl/SimpleAppService");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

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
  create({
    taskManager,
    store,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    let appService = null;
    let AppService = null;
    switch (config.get("appService.type")) {
      case "simple":
        AppService = SimpleAppService;
        break;
      default:
        AppService = SimpleAppService;
    }

    try {
      appService = new AppService({ taskManager, store, config, logger });
    } catch (e) {
      console.log(e);
    }

    return appService;
  }
}
let factory;
factory = factory ? factory : new AppServiceFactory();
module.exports = factory;
