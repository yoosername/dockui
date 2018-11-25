const  {
  validateShapes
} = require("../../util/validate");

/**
 * @class PluginModule
 * @description Represents a single Plugin Module loaded from a PluginModuleDescriptor.
 * @argument {Plugin} plugin - The plugin which loaded us.
 * @argument {Plugin} pluginModuleDescriptor - The raw descriptor used to load us
 * @argument {string} pluginModuleKey - The unique key.
 */
class PluginModule{

  constructor(
    plugin,
    pluginModuleDescriptor,
    pluginModuleKey
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"Plugin","object":plugin},
      {"shape":"PluginModuleDescriptor","object":pluginModuleDescriptor}
    ]);

    this.plugin = plugin; 
    this.pluginModuleDescriptor = pluginModuleDescriptor; 
    this.pluginModuleKey = pluginModuleKey;
    this.pluginModuleType = pluginModuleDescriptor.getType();

  }
 
  /**
   * @method getKey
   * @description The key of this Module
   */
  getKey(){
    return this.pluginModuleKey;
  }

  /**
   * @method getType
   * @description The type of this Module
   */
  getType(){
    return this.pluginModuleType;
  }

  /**
   * @method enable
   * @description delegate enabling and disabling to our plugins loader
   */
  enable(){
    this.plugin.getPluginLoader().enablePluginModule(this);
  }

  /**
   * @method disable
   * @description delegate enabling and disabling to our plugins loader
   */
  disable(){
    this.plugin.getPluginLoader().disablePluginModule(this);
  }

}

module.exports = PluginModule;