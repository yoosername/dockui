const AppStore = require("../AppStore");
const { Config } = require("../../config/Config");

/**
 * @description Simple Store for persisting App/AppModule state to memory
 */
class InMemoryAppStore extends AppStore {
  /**
   * @argument {Config} config Optional runtime config
   * @returns {AppStore}
   */
  constructor({ config = new Config() } = {}) {
    super(config);
    this.data = {};
  }

  /**
   * @description Store data (using its id or a generated id as unique ref)
   * @argument {Object} data The object to save
   */
  create(data) {
    this.data[data.id] = data;
  }

  /**
   * @description Read data by its id
   * @argument {String} id The id of the object to return
   */
  read(id) {
    return this.data && this.data[id] ? this.data[id] : null;
  }

  /**
   * @description Update existing data by its id
   * @argument {String} id The id of the object to update
   * @argument {Object} data The partial object containing updated keys
   */
  update(id, data) {
    const item = this.read(id);
    if (item) {
      this.data[item.id] = Object.assign({}, this.data[item.id], data);
    }
  }

  /**
   * @description Delete an entry by its id
   * @argument {String} id The id of the object to delete
   */
  delete(id) {
    const item = this.read(id);
    if (item) {
      this.data[id] = null;
      delete this.data[id];
    }
    return item;
  }

  /**
   * @description find objects that match the passed in predicate
   * @argument {Object} predicate Truthy function which tests for a match
   * @returns {Array} Array of matching objects
   */
  find(predicate) {
    const found = [];
    if (predicate && typeof predicate === "function") {
      Object.keys(this.data).forEach(key => {
        if (predicate(this.data[key])) {
          found.push(this.data[key]);
        }
      });
      return found;
    }
    return this.data;
  }
}

module.exports = InMemoryAppStore;
