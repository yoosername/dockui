/**
 * @description Log Lifecycle transition state
 * @ignore
 */
function logAppInstallStarted(payload) {
  "use strict";
  const app = payload.app;
  const state = payload.type;
  console.log(
    "[LifecycleEventsStrategy] App (" + app.getKey() + ") state is : ",
    state
  );
}

module.exports = {
  logAppInstallStarted
};
