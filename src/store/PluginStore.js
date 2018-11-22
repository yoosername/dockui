/**
 * @class PluginStore
 * @description Simple Store for persisting Plugin/Module state
 */
class PluginStore{

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

module.exports = PluginStore;