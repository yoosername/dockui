const AppStore = require("../AppStore");
const APP_ENABLED_KEY_PREFIX = "APP_ENABLED_";
const MODULE_ENABLED_KEY_PREFIX = "MODULE_ENABLED_";

/**
 * @class InMemoryAppStore
 * @description Simple Store for persisting App/AppModule state to memory
 */
class InMemoryAppStore extends AppStore{

    constructor(){
        super();
        this.data = {};
    }

    /**
    * @method set
    * @description Store the value against the given key
    */
    set(key, val){
        this.data[key] = val;
    }

    /**
    * @method get
    * @description Retrieve the value for the provided key
    */
    get(key){
        return this.data[key];
    }

    /**
    * @method delete
    * @description Delete an entry by its key
    */
    delete(key){
        var data = this.data[key];
        this.data[key] = null;
        delete this.data[key];
        return data;
    }

    /**
    * @method enableApp
    * @argument {App} app - the app to mark as enabled
    * @description Mark an App as enabled in the store
    */
    enableApp(app){
        this.set(APP_ENABLED_KEY_PREFIX+app.getKey(), true);
    }

    /**
    * @method disableApp
    * @argument {App} app - the app to mark as disabled
    * @description Mark an App as disabled in the store
    */
    disableApp(app){
        this.set(APP_ENABLED_KEY_PREFIX+app.getKey(), false);
    }

    /**
    * @method enableModule
    * @argument {Module} module - the module to mark as enabled
    * @description Mark a specific Apps Module as enabled in the store
    */
    enableModule(module){
        this.set(MODULE_ENABLED_KEY_PREFIX+module.getKey(), true);
    }

    /**
    * @method disableModule
    * @argument {Module} module - the module to mark as disabled
    * @description Mark a specific Apps Module as disabled in the store
    */
    disableModule(module){
        this.set(MODULE_ENABLED_KEY_PREFIX+module.getKey(), false);
    }

}

module.exports = InMemoryAppStore;