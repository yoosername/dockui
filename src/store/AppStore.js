/**
 * @class AppStore
 * @description Simple Store for persisting App/AppModule state
 */
class AppStore{

    constructor(){
    }

    /**
    * @method set
    * @description Store the value against the given key
    */
    set(key, val){
        console.warn("[AppStore] set - NoOp implementation - this should be extended by child classes");
    }

    /**
    * @method get
    * @description Retrieve the value for the provided key
    */
    get(key){
        console.warn("[AppStore] get - NoOp implementation - this should be extended by child classes");
    }

    /**
    * @method delete
    * @description Delete an entry by its key
    */
    delete(key){
        console.warn("[AppStore] delete - NoOp implementation - this should be extended by child classes");
    }

    /**
    * @method enableApp
    * @argument {App} app - the app to mark as enabled
    * @description Mark an App as enabled in the store
    */
   enableApp(app){
        console.warn("[AppStore] enableApp - NoOp implementation - this should be extended by child classes");
   }

    /**
    * @method disableApp
    * @argument {App} app - the app to mark as disabled
    * @description Mark an App as disabled in the store
    */
   disableApp(app){
        console.warn("[AppStore] disableApp - NoOp implementation - this should be extended by child classes");
   }

    /**
    * @method enableModule
    * @argument {Module} module - the module to mark as enabled
    * @description Mark a specific Apps Module as enabled in the store
    */
   enableModule(app){
        console.warn("[AppStore] enableModule - NoOp implementation - this should be extended by child classes");
   }

    /**
    * @method disableModule
    * @argument {Module} module - the module to mark as disabled
    * @description Mark a specific Apps Module as disabled in the store
    */
   disableModule(app){
        console.warn("[AppStore] disableModule - NoOp implementation - this should be extended by child classes");
   }

}

module.exports = AppStore;