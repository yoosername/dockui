/**
 * @object AppPermission
 * @description Represents the permitted behaviour of a loaded App.
 *              - READ App can be notified about events but cannot contribute any modules which modify the system
 *              - WRITE (includes READ) App can also contribute Modules such as WebPage WebResource etc which may modify behaviour
 *              - ADMIN (includes READ,WRITE) App can also use the managment API to e.g. load,unload,enable,diable Apps and Modules
 */
const AppPermission = Object.freeze({
  READ: "READ",
  WRITE: "WRITE",
  ADMIN: "ADMIN"
});

module.exports = AppPermission;
