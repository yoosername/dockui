/**
 * @description Creates a Module object from a descriptor
 */
class ModuleLoader {
  /**
   * @description Return true if this descriptor can be parsed by this Loader.
   *              Implementations should:
   *               - Parse descriptor
   *               - Check and validate values
   *               - Return true if can successfully create a Module
   *               - Return false if cannot create Module
   * @argument {ModuleDescriptor} descriptor The ModuleDescriptor to test
   */
  canLoadModuleDescriptor(descriptor) {
    console.warn(
      "[ModuleLoader] NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Create and return a new RouteModule from the descriptor
   *              Implementations should:
   *               - Parse descriptor
   *               - Check and validate values
   *               - Return new subclass Module object
   * @argument {ModuleDescriptor} descriptor The ModuleDescriptor to load
   */
  loadModuleFromDescriptor(descriptor) {
    console.warn(
      "[ModuleLoader] NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = ModuleLoader;
