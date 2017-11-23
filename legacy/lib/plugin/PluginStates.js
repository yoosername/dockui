var keyMirror = require("keymirror");

var PluginStates = keyMirror({
  INACTIVE: null,
  STARTING: null,
  ACTIVE: null,
  STOPPING: null,
  DEACTIVATED: null,
  ERROR: null
});

module.exports = PluginStates;
