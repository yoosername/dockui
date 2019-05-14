# Loaders

## AppLoader

> An AppLoader uses Module Loaders to create an App from a source URL, or String descriptor

### API

#### load(url)

Loads descriptor by retriving the descriptor from URL then parsing it

#### load(descriptor)

Loads descriptor string using Module loaders to parse each module section

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
