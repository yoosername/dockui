/**
 * @class Store
 * @description NoOp Store implementation
 */
class Store{

    set(key, val){
        console.warn("Youve used the default NoOp Store implementation - this should be extended by child classes");
    }

    get(key){
        console.warn("Youve used the default NoOp Store implementation - this should be extended by child classes");
    }

}

module.exports = Store;