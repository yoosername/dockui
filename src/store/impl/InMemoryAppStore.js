const AppStore = require("../AppStore");
const { Config } = require("../../config/Config");
const APP_STATE_KEY_PREFIX = "APP_STATE_";

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
    var data = this.data[id];
    this.data[id] = null;
    delete this.data[id];
    return data;
  }

  /**
   * @description find objects that match the passed in filter
   * @argument {Object} filter The filter object containing keys that should match
   * @returns {Array} Array of matching objects
   */
  find(filter) {
    const found = [];
    Object.keys(this.data).forEach(key => {
      if (filter) {
        if (filter(this.data[key])) {
          found.push(this.data[key]);
        }
      } else {
        found.push(this.data[key]);
      }
    });
    return found;
  }
}

module.exports = InMemoryAppStore;
