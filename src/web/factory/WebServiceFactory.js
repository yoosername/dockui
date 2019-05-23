const SimpleKoaWebService = require("../impl/SimpleKoaWebService");
const { Config } = require("../../config/Config");

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
  create({ appService, config = new Config(), logger } = {}) {
    let webService = null;
    let WebService = null;
    switch (config.get("webService.type")) {
      case "":
        WebService = SimpleKoaWebService;
      default:
        WebService = SimpleKoaWebService;
    }
    try {
      webService = new WebService({ appService, config, logger });
    } catch (e) {
      logger.error("Error creating WebService: %o", e);
    }
    return webService;
  }
}
let factory;
factory = factory ? factory : new WebServiceFactory();
module.exports = factory;
