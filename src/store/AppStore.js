const  {
    validateShapes
} = require("../util/validate");

/**
 * @class AppStore
 * @description Simple Store for persisting App/AppModule state
 */
class AppStore{

    constructor(eventService){
        this.eventService = eventService;

        validateShapes([
            {"shape":"EventService","object":eventService}
        ]);
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

}

module.exports = AppStore;