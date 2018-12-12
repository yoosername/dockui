/**
 * @class DefaultAppStore
 * @description Simple Store for persisting App/AppModule state
 */
class DefaultAppStore{

    set(key, val){
        console.warn("Youve used the default NoOp Store implementation - this should be extended by child classes");
    }

    get(key){
        console.warn("Youve used the default NoOp Store implementation - this should be extended by child classes");
    }

    // implement this
    // "set","get","enablePlugin","disablePlugin",
    //         "enablePluginModule","disablePluginModule"

}

module.exports = DefaultAppStore;