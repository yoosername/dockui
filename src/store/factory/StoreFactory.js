const InMemoryAppStore = require("../impl/InMemoryAppStore");
const { Config } = require("../../config/Config");

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
  create(config = new Config()) {
    let store = null;
    switch (config.get("store.type")) {
      case "":
        store = new InMemoryAppStore(config);
      //case "postgres" : store = new PostgresBackedAppStore(config);
      default:
        store = new InMemoryAppStore(config);
    }
    return store;
  }
}
let factory;
factory = factory ? factory : new StoreFactory();
module.exports = factory;
