const  {
  validateShapes
} = require("../../util/validate");

/**
 * @class AppModule
 * @description Represents a single App Module loaded from a AppModuleDescriptor.
 * @argument {App} app - The App which loaded us.
 * @argument {App} appModuleDescriptor - The raw descriptor used to load us
 * @argument {string} appModuleKey - The unique key.
 */
class AppModule{

  constructor(
    app,
    appModuleDescriptor,
    appModuleKey
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"App","object":app},
      {"shape":"AppModuleDescriptor","object":appModuleDescriptor}
    ]);

    this.app = app; 
    this.appModuleDescriptor = appModuleDescriptor; 
    this.appModuleKey = appModuleKey;
    this.appModuleType = appModuleDescriptor.getType();

  }
 
  /**
   * @method getKey
   * @description The key of this Module
   */
  getKey(){
    return this.appModuleKey;
  }

  /**
   * @method getType
   * @description The type of this Module
   */
  getType(){
    return this.appModuleType;
  }

  /**
   * @method enable
   * @description delegate enabling and disabling to our Apps loader
   */
  enable(){
    this.app.getAppLoader().enableAppModule(this);
  }

  /**
   * @method disable
   * @description delegate enabling and disabling to our Apps loader
   */
  disable(){
    this.app.getAppLoader().disableAppModule(this);
  }

}

module.exports = AppModule;