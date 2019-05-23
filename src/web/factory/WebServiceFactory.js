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
  create({ appService, config = new Config() } = {}) {
    let webService = null;
    if (!config) return new SimpleKoaWebService({ appService, config });
    switch (config.get("webService.type")) {
      case "":
        webService = new SimpleKoaWebService({ appService, config });
      //case "management" : webService = new ManagementOnlyWebService(appService, config);
      default:
        webService = new SimpleKoaWebService({ appService, config });
    }
    return webService;
  }
}
let factory;
factory = factory ? factory : new WebServiceFactory();
module.exports = factory;
