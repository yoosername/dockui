/**
 * Loads a resource into a Config object
 */
class ConfigLoader{

    /**
     * Loads a resource and returns a new {Config} object
     * @returns {Config} The Config
     */
    load(){
        console.warn("This method is a Raw NoOp. Expect consumers to provide concrete implementation via subclass");
    }

}

module.exports = ConfigLoader;