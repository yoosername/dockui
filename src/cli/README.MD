# DockUI CLI

> Interface for managing a DockUI instance from the command line

### Example

```shell
$ dockui --help -vvvvv

  Usage
    $ dockui <cmd>

  Options
    --help, -h       Show this usage
    -v               Increment the logging verbosity
    --instance, -i   Specify the instance to run commands against
    --quiet, -q      Quiet mode

  Examples
    $ dockui run                             Start new instance
    $ dockui env                             Output config ( merged from all sources )
    $ dockui app ls                          List all loaded Apps
    $ dockui app load <url> [permission]     Load a single App from its URL and optionally grant a permission
    $ dockui app reload <appId> [permission] Load a single App from its URL and optionally grant a permission
    $ dockui app unload <appId>              Unload (delete) a single App by its ID
    $ dockui app enable <appId>              Enable a single app by its ID
    $ dockui app disable <appId>             Disable a single app by its ID
    $ dockui mod ls                          List all Modules of Loaded Apps
    $ dockui mod enable <modId>              Enable a single module by its ID
    $ dockui mod disable <modId>             Disable a single module by its ID

  Info
    Log Level:  debug
    Instance:  http://localhost:8080
```
