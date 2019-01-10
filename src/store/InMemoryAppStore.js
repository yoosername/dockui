const AppStore = require("./AppStore");

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

}

module.exports = InMemoryAppStore;