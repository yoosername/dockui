# Loaders

## AppLoader

> An AppLoader Takes an AppDescriptor and attempts to load it asyncronously resolving with the loaded App, or throwing an Error

## ModuleLoader

> A ModuleLoader is used by an AppLoader to load specific Module types from its corresponding ModuleDescriptor.

- There are as many ModuleLoaders as there are Module types.
- If no Module loader can handle the Module it will simply be disabled

## API

### canLoadModuleDescriptor()

Return true if this descriptor can be parsed by this Loader.

Implementations should:

- Parse descriptor
- Check and validate values
- Return true if can successfully create a Module
- Return false if cannot create Module

### loadModuleFromDescriptor()

Create and return a new RouteModule from the descriptor

Implementations should:

- Parse descriptor
- Check and validate values
- Return new subclassed Module object
