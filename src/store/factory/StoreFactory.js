/**
 * @description StoreFactory has a single method .create which generates
 *              a Store instance based on passed in Environment Context
 */
class StoreFactory {
  constructor() {}

  /**
   * @async
   * @description Return new Store based on passed in ctx
   * @argument {String} ctx The environment context to parse
   * @return {Store} A instance of a Store
   */
  create(ctx) {
    // TODO: Implement logic to return a specific type of store based on env
    return new require("../impl/InMemoryAppStore");
  }
}

module.exports = StoreFactory;
