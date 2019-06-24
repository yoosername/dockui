const Module = require("../Module");
const ApiModule = require("../impl/ApiModule");
const AuthenticationProviderModule = require("../impl/AuthenticationProviderModule");
const AuthorizationProviderModule = require("../impl/AuthorizationProviderModule");
const RouteModule = require("../impl/RouteModule");
const WebFragmentModule = require("../impl/WebFragmentModule");
const WebHookModule = require("../impl/WebHookModule");
const WebItemModule = require("../impl/WebItemModule");
const WebPageModule = require("../impl/WebPageModule");
const WebResourceModule = require("../impl/WebResourceModule");

/**
 * @description ModuleFactory has a single method .create which generates
 *              a Module instance based on passed in type
 */
class ModuleFactory {
  constructor() {}

  /**
   * @async
   * @description Return new instance of Module based on type of passed in module shape
   * @argument {String} module The shape of module to create
   * @return {Module} A instance of Module based on module.type
   */
  create({ module = { type: Module.DESCRIPTOR_TYPE } } = {}) {
    let ModuleConstructor = null;
    let type = module && module.type ? module.type : "";
    switch (type) {
      case ApiModule.DESCRIPTOR_TYPE:
        ModuleConstructor = ApiModule;
        break;
      case AuthenticationProviderModule.DESCRIPTOR_TYPE:
        ModuleConstructor = AuthenticationProviderModule;
        break;
      case AuthorizationProviderModule.DESCRIPTOR_TYPE:
        ModuleConstructor = AuthorizationProviderModule;
        break;
      case RouteModule.DESCRIPTOR_TYPE:
        ModuleConstructor = RouteModule;
        break;
      case WebFragmentModule.DESCRIPTOR_TYPE:
        ModuleConstructor = WebFragmentModule;
        break;
      case WebHookModule.DESCRIPTOR_TYPE:
        ModuleConstructor = WebHookModule;
        break;
      case WebItemModule.DESCRIPTOR_TYPE:
        ModuleConstructor = WebItemModule;
        break;
      case WebPageModule.DESCRIPTOR_TYPE:
        ModuleConstructor = WebPageModule;
        break;
      case WebResourceModule.DESCRIPTOR_TYPE:
        ModuleConstructor = WebResourceModule;
        break;
      default:
        ModuleConstructor = Module;
    }
    return new ModuleConstructor(module);
  }
}
let factory;
factory = factory ? factory : new ModuleFactory();
module.exports = factory;
