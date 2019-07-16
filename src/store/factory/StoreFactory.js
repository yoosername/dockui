const InMemoryAppStore = require("../impl/InMemoryAppStore");
const LokiAppStore = require("../impl/LokiAppStore");
const { Config } = require("../../config/Config");
const LoggerFactory = require("../../log/factory/LoggerFactory");

/**
 * @description StoreFactory has a single method .create which generates
 *              a Store instance based on passed in Config
 */
class StoreFactory {
  constructor() {}

  /**
   * @async
   * @description Return new Store based on passed in config
   * @argument {Config} config The runtime config
   * @return {Store} A instance of a Store
   */
  create({
    config = new Config(),
    logger = LoggerFactory.create(config)
  } = {}) {
    let Store,
      instance = null;
    const type = config.get("store.type");
    const filename = config.get("store.db.filename");
    logger = logger.child({
      config: { "service.name": "StoreFactory" }
    });
    logger.debug("Store specified in Config as 'store.type=%s'", type);
    switch (type) {
      case "memory":
        Store = InMemoryAppStore;
        break;
      case "lokijs":
        Store = LokiAppStore;
        break;
      default:
        Store = InMemoryAppStore;
    }
    logger.debug(
      "Creating instance of Store using %s, logfile=%s",
      Store.name,
      filename
    );
    instance = new Store({ config, logger });
    return instance;
  }
}
let factory;
factory = factory ? factory : new StoreFactory();
module.exports = factory;
