/**
 * @description Encapsulates an external App and its Descriptor to be loaded
 */
class AppLoader {
  /**
   * @argument {AppDescriptor} appDescriptor - The App descriptor to load from.
   * @argument {Array} moduleLoaders - The module loaders to use for loading Modules.
   */
  constructor(appDescriptor, moduleLoaders) {
    this.appDescriptor = appDescriptor;
    this.moduleLoaders = moduleLoaders;
  }

  /**
   * @description Attempt to async (re)Load the relevant App by:
   *              1: Checking availability
   *              2: Performing Security Handshake
   *              3: Loading each module using passed in ModuleLoaders
   *              4: Resolves with the loaded App object
   * @argument {AppDescriptor} appDescriptor - The App descriptor to load from.
   * @argument {Array} moduleLoaders - The module loaders to use for loading Modules.
   */
  load(appDescriptor, moduleLoaders) {
    this.appDescriptor = appDescriptor;
    this.moduleLoaders = moduleLoaders;
  }
}

module.exports = AppLoader;
