/**
 * @description Simple Store for persisting various state objects
 */
class AppStore {
  constructor() {}

  /**
   * @description Store data (using its id or a generated id as unique ref)
   * @argument {Object} data The object to save
   */
  create(data) {
    console.warn(
      "[AppStore] create - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Read data by its id
   * @argument {String} id The id of the object to return
   */
  read(id) {
    console.warn(
      "[AppStore] read - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Update existing data by its id
   * @argument {String} id The id of the object to update
   * @argument {Object} data The partial object containing updated keys
   */
  update(id, data) {
    console.warn(
      "[AppStore] update - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Delete an entry by its id
   * @argument {String} id The id of the object to delete
   */
  delete(id) {
    console.warn(
      "[AppStore] delete - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description find objects that match the passed in filter
   * @argument {Object} filter The filter object containing keys that should match
   * @returns {Array} Array of matching objects
   */
  find(filter) {
    console.warn(
      "[AppStore] find - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = AppStore;
