const fs = require("fs");
const ConfigLoader = require("./ConfigLoader");

/**
 * Loads a resource into a Config object
 */
class ConfigFileLoader extends ConfigLoader{

    /**
     * @argument the path of the file to load
     */
    constructor(path){
        if(!path){
            throw new Error("ConfigFileLoader: You must specify a path");
        }
        super();
        this.path = path;
        this.resource = null;
        this.loadResource(path);
    }

    /**
     * Loads a resource from a filepath and stores it in this.resource
     * @returns {String} The path to the config file
     */
    loadResource(path){
        var tmpResource = null;
        try{
            tmpResource = fs.readFileSync(path, { encoding: 'utf8' });
        }catch(e){
            console.warn("Error loading Config file from: ", path, ", Error: ", e);
        }
        if(tmpResource){
            this.resource = tmpResource;
            return;
        }
    }

}

module.exports = ConfigFileLoader;