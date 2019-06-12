const AppStore = require("../AppStore");
const { Config } = require("../../config/Config");
const Logger = require("../../log/Logger");
const Lokijs = require("lokijs");
const DEFAULT_LOKI_DB = "loki.db";
const DEFAULT_LOKI_DB_CONFIG_KEY = "store.db.filename";
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
    this.logger = logger;
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
            autoload: true,
            autosave: true,
            autosaveInterval: 4000,
            autoloadCallback: this.initLokiDB.bind(this)
          });
    } catch (err) {
      this.logger.error("Error instantiating LOKIDB - error = %o", e);
    }
  }

  /**
   * @description Initialize the LokiJS DB e.g. add required collections
   */
  initLokiDB() {
    // Load or add required collections
    try {
      this.lokiDB.loadDatabase({}, err => {
        if (err) {
          this.logger.error("Error loading LOKI DB error = %o", err);
        }
        this.collection = this.lokiDB.getCollection(DEFAULT_LOKI_COLLECTION_ID);
        if (!this.collection) {
          this.collection = this.lokiDB.addCollection(
            DEFAULT_LOKI_COLLECTION_ID,
            {
              indices: ["id"],
              unique: ["id"]
            }
          );
        }
        this.logger.debug("LOKI DB loaded successfully");
      });
    } catch (err) {
      this.logger.error("Error loading LOKI collection - error = %o", e);
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
    let updatedData;
    if (persistedData) {
      try {
        updatedData = Object.assign({}, persistedData, data);
        this.collection.update(updatedData);
      } catch (err) {
        this.logger.error(
          "Problem updating data with (id=%s) in Loki store, error = %o",
          id,
          err
        );
      }
    }
  }

  /**
   * @description Delete an entry by its id
   * @argument {String} id The id of the object to delete
   */
  delete(id) {
    let persistedData = null;
    try {
      persistedData = this.read(id);
      if (persistedData) {
        this.collection.remove(persistedData);
      }
    } catch (err) {
      this.logger.error("Problem deleting data in Loki store, error = %o", err);
      throw err;
    }
    return persistedData;
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
