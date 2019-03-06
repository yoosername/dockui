/**
 * @description Log Lifecycle transition state
 * @ignore
 */
function log(payload) {
  "use strict";
  console.log("[LifecycleEventsStrategy] ", payload);
}

module.exports = {
  log
};
