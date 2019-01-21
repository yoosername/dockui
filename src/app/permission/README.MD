# AppPermission

  > Represents the permitted behaviour of a loaded App.

## AppPermission.READ

* App can be notified about events
* App cannot contribute any modules which modify behaviour

## AppPermission.WRITE

> Assumes AppPermission.READ

* App can also contribute Modules such as WebPage WebResource etc which may modify behaviour
* App cannot perform admin functions

## AppPermission.ADMIN

> Assumes AppPermission.READ and AppPermission.WRITE

* App can also use the managment API to perform admin functions for example:
  * load,unload,enable,diable Apps and Modules