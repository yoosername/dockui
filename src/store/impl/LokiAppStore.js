const AppStore = require("../AppStore");
const { Config } = require("../../config/Config");
const Logger = require("../../log/Logger");
const Lokijs = require("lokijs");
const DEFAULT_LOKI_DB = "loki-appstore.db";
const DEFAULT_LOKI_DB_CONFIG_KEY = "loki.db.filename";
const DEFAULT_LOKI_COLLECTION_ID = "app";

/**
 * @description Simple Store for persisting App/AppModule state to memory
 */
class LokiAppStore extends AppStore {
  /**
   * @argument {Config} config Optional runtime config
   * @argument {Logger} logger Optional Logger
   * @returns {AppStore}
   */
  constructor({
    config = new Config(),
    logger = new Logger(config),
    loki
  } = {}) {
    super({ config, logger });
    this.configure(loki);
  }

  /**
   * @description Configure LokiJS
   * @argument {Loki} loki Existing instance of loki to use in stead of creating new one
   */
  configure(loki) {
    // Get filename from config or use a default
    let filename = this.config.get(DEFAULT_LOKI_DB_CONFIG_KEY);
    filename = filename ? filename : DEFAULT_LOKI_DB;

    // Instantiate the DB based on passed in DB or a fresh one
    try {
      this.lokiDB = loki
        ? loki
        : new Lokijs(filename, {
            autosave: true
          });
    } catch (err) {
      logger.error("Error instantiating LOKIDB - error = %o", e);
    }

    // Load or add required collections
    try {
      this.lokiDB.loadDatabase({}, err => {
        if (err) {
          logger.error("Error loading LOKI DB error = %o", err);
        }
        this.collection = this.lokiDB.getCollection(DEFAULT_LOKI_COLLECTION_ID);
        if (!this.collection) {
          this.collection = this.lokiDB.addCollection(
            DEFAULT_LOKI_COLLECTION_ID
          );
        }
      });
    } catch (err) {
      logger.error("Error loading LOKI collection - error = %o", e);
    }
  }

  /**
   * @description Store data (using its id or a generated id as unique ref)
   * @argument {Object} data The object to save
   */
  create(data) {
    this.collection.insert(data);
  }

  /**
   * @description Read data by its id
   * @argument {String} id The id of the object to return
   */
  read(id) {
    return this.collection.findOne({ id });
  }

  /**
   * @description Update existing data by its id
   * @argument {String} id The id of the object to update
   * @argument {Object} data The partial object containing updated keys
   */
  update(id, data) {
    let persistedData = this.read(id);
    persistedData = Object.assign({}, persistedData, data);
    this.collection.update(persistedData);
  }

  /**
   * @description Delete an entry by its id
   * @argument {String} id The id of the object to delete
   */
  delete(id) {
    const item = this.read(id);
    if (item) {
      this.collection.remove(item);
    }
    return item;
  }

  /**
   * @description find objects that match the passed in predicate
   * @argument {Object} predicate Truthy function which tests for a match
   * @returns {Array} Array of matching objects
   */
  find(predicate) {
    return this.collection.where(predicate);
  }
}

module.exports = LokiAppStore;
