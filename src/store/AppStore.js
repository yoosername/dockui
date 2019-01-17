/**
 * @description Simple Store for persisting App/AppModule state
 */
class AppStore{

    constructor(){
    }

    /**
    * @description Store the value against the given key
    */
    set(key, val){
        console.warn("[AppStore] set - NoOp implementation - this should be extended by child classes");
    }

    /**
    * @description Retrieve the value for the provided key
    */
    get(key){
        console.warn("[AppStore] get - NoOp implementation - this should be extended by child classes");
    }

    /**
    * @description Delete an entry by its key
    */
    delete(key){
        console.warn("[AppStore] delete - NoOp implementation - this should be extended by child classes");
    }

     /**
     * @description Store the state of an App
     */
     saveAppState(app){
          console.warn("[AppStore] saveAppState - NoOp implementation - this should be extended by child classes");
     }

     /**
     * @description Retrieve the state of an App
     */
     getAppState(app){
          console.warn("[AppStore] getAppState - NoOp implementation - this should be extended by child classes");
     }

}

module.exports = AppStore;