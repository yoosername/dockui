const ConfigFileLoader = require("./ConfigFileLoader");
const {Config} = require("./Config");

const yaml = require('js-yaml');

/**
 * Loads a YAML resource into a Config object
 */
class ConfigYAMLLoader extends ConfigFileLoader{

    /**
     * @argument the path to the YAML file
     */
    constructor(path){
        super(path);
    }

    /**
     * Returns a Config file built from a parsed YAML file
     * @returns {Config} The processed Config
     */
    load(){

        var doc;
        var config;

        if(this.resource){

            // Parse the YAML out of it
            try {
                doc = yaml.safeLoad(this.resource);
            } catch (e) {
                console.error("Could not load Config from YAML file, error: ",e);
            }

            // Try to build a Config File from the YAML generated Object
            if(doc && typeof doc === "object"){
                config = new Config();

                if(doc.version){
                    config.withVersion(doc.version);
                }

                if(doc.default){
                    config.withDefaultInstance(doc.default);
                }
                
                // { 
                //     version: CONFIG_VERSION,
                //     instances:
                //     { prod:
                //         { name: INSTANCE1_NAME,
                //             uuid: INSTANCE1_UUID,
                //             description: INSTANCE1_DESCRIPTION,
                //             management:
                //             { api:
                //                 { socket: { path: INSTANCE1_SOCKET },
                //                 http: { port: INSTANCE1_PORT },
                //                 creds: { user: INSTANCE1_USER, password: INSTANCE1_PASS } } } } },
                //     default: 'prod' 
                // }
            }
        }else{
            console.error("Could not load Config from YAML file: ", this.path);
        }

        if(config && config.build){
            return config.build();
        }else{
            console.error("Could not Parse YAML from Config file: ", this.path);
        }
    }

}

module.exports = ConfigYAMLLoader;