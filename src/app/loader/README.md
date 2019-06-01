# Loaders

## AppLoader

> An AppLoader (with optional Module Loaders) returns an App from a source (e.g. URL, or String)

### API

#### load()

Overload this method to provide App loading functionality

## ModuleLoader

> A ModuleLoader is used by an AppLoader to load specific Module types from a corresponding Descriptor Module section.

- There are as many ModuleLoaders as there are Module types.
- If no Module loader can handle the Module it will simply be disabled

### API

#### canLoadModuleDescriptor()

Return true if this descriptor can be parsed by this Loader.

Implementations should:

- Parse descriptor
- Check and validate values
- Return true if can successfully create a Module
- Return false if cannot create Module

#### loadModuleFromDescriptor()

Create and return a new RouteModule from the descriptor

Implementations should:

- Parse descriptor
- Check and validate values
- Return new subclassed Module object
