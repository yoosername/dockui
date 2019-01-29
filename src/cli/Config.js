const  {
    ConfigValidationError
} = require("../constants/errors");

/**
 * A Config encapsulates configuration information derived from a DockUI config source
 */
class Config{

    /**
     * @argument {ConfigBuilder} builder
     * @throws ConfigValidationError
     */
    constructor(builder){
        if(!builder){
            return new ConfigBuilder();
        }

        this.version = builder.version;
        this.defaultInstance = builder.defaultInstance;
        this.instances = builder.instances;
    }

}

/**
 * @description Builder that generates a DockUI Config
 */
class ConfigBuilder{

    constructor(){
        this.version = null;
        this.instances = null;
        this.defaultInstance = null;
    }

    /**
     * @description Specifies the Config Version ( Derived from the Loader which loaded us )
     * @argument {String} version
     * @returns {ConfigBuilder} the current config builder for chaining
     */
    withVersion(version){
        this.version = version;
        return this;
    }

    /**
     * @description Specifies which instance to use when none is specified during CLI calls
     * @argument {String} instanceName
     * @returns {ConfigBuilder} the current config builder for chaining
     */
    withDefaultInstance(instanceName){
        this.defaultInstance = instanceName;
        return this;
    }

    /**
     * @description A single DockUI Instance Config
     * @argument {InstanceConfig} instanceConfig
     * @returns {ConfigBuilder} the current config builder for chaining
     */
    withInstance(instanceConfig){
        this.instances = (this.instances) ? this.instances : {};
        this.instances[instanceConfig.name] = instanceConfig.name;
        return this;
    }

    /**
     * @description return a new Config instance using the builder values
     * @returns {Config} instance of Config
     */
    build(){
        return new Config(this);
    }

}

/**
 * An InstanceConfig encapsulates all of the runtime options of a single DockUI instance (e.g prod,ref etc)
 */
class InstanceConfig{

    /**
     * @argument {InstanceConfigBuilder} builder
     * @throws InstanceConfigValidationError
     */
    constructor(builder){
        if(!builder){
            return new InstanceConfigBuilder();
        }

        this.name = builder.name;
        this.uuid = builder.uuid;
        this.description = builder.description;
        this.socket = builder.socket;
        this.port = builder.port;
        this.creds = builder.creds;
    }

}

/**
 * @description Builder that generates a DockUI InstanceConfig
 */
class InstanceConfigBuilder{

    constructor(){
        this.name = null;
        this.uuid = null;
        this.description = null;
        this.socket = null;
        this.port = null;
        this.creds = null;
    }

    /**
     * @description The unique name of the Instance
     * @returns {InstanceConfigBuilder} this InstanceConfigBuilder for chaining
     */
    withName(name){
        this.name = name;
        return this;
    }

    /**
     * @description The unique UUID of the Instance
     * @returns {InstanceConfigBuilder} this InstanceConfigBuilder for chaining
     */
    withUUID(uuid){
        this.uuid = uuid;
        return this;
    }

    /**
     * @description A Human readable description of the instance
     * @returns {InstanceConfigBuilder} this InstanceConfigBuilder for chaining
     */
    withDescription(description){
        this.description = description;
        return this;
    }

    /**
     * @description The management socket path for local admin and CLI access
     * @returns {InstanceConfigBuilder} this InstanceConfigBuilder for chaining
     */
    withSocket(path){
        this.socket = path;
        return this;
    }

    /**
     * @description The Http Port that DockUI Gateway and Management API are served from
     * @returns {InstanceConfigBuilder} this InstanceConfigBuilder for chaining
     */
    withPort(port){
        this.port = port;
        return this;
    }

    /**
     * @description The Global Admin credentials that this instance is started with. 
     *              Used by the CLI to make calls to the management API
     * @returns {InstanceConfigBuilder} this InstanceConfigBuilder for chaining
     */
    withCreds(username,password){
        this.creds = {
            username: username,
            password: password
        };
        return this;
    }

    /**
     * @description Validate options and return a new Config instance
     * @returns {Config} instance of Config
     */
    build(){
        return new InstanceConfig(this);
    }

}

module.exports = {
    Config,
    ConfigBuilder,
    InstanceConfig,
    InstanceConfigBuilder
};