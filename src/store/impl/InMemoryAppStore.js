const AppStore = require("../AppStore");
const APP_STATE_KEY_PREFIX = "APP_STATE_";
const APP_ENABLED_KEY_PREFIX = "APP_ENABLED_";
const MODULE_ENABLED_KEY_PREFIX = "MODULE_ENABLED_";

/**
 * @description Simple Store for persisting App/AppModule state to memory
 */
class InMemoryAppStore extends AppStore{

    constructor(){
        super();
        this.data = {};
    }

    /**
    * @description Store the value against the given key
    */
    set(key, val){
        this.data[key] = val;
    }

    /**
    * @description Retrieve the value for the provided key
    */
    get(key){
        return this.data[key];
    }

    /**
    * @description Delete an entry by its key
    */
    delete(key){
        var data = this.data[key];
        this.data[key] = null;
        delete this.data[key];
        return data;
    }

    /**
    * @argument {App} app - the app which state we want to save
    * @description Store the state of an App
    */
    saveState(app){
        let oldState = this.getAppState(app);
        oldState = (oldState) ? oldState : {};
        const newState = {
            uuid: app.getUUID(),
            key: app.getKey(),
            enabled: app.isEnabled(),
            modules: []
        };
        app.getModules().forEach((module)=>{
            newState.modules.push({
                key: module.getKey(),
                enabled: module.isEnabled()
            });
        });
        const saveState = Object.assign({},oldState,newState);
        this.set(APP_STATE_KEY_PREFIX+app.getUUID(), saveState);
    }

    /**
    * @argument {App} app - the app which state we want to fetch
    * @description Retrieve the state of an App
    */
    getState(app){
        return this.get(APP_STATE_KEY_PREFIX+app.getUUID());
    }


}

module.exports = InMemoryAppStore;