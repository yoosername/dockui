/**
 * @function enableAppOnLoad
 * @description When Apps are loaded successfully - 
 *       if were not previously disabled, enable them now
 */
function enableAppOnLoad(payload){
    "use strict";

    const app = payload.app;
    const store = this.appStore;
    const state = store.get(app.getKey());
    if(state.disabled !== true){
        app.enable();
        console.log("[LifecycleEventsStrategy] App ("+app.getKey()+") has been installed and is not stored as disabled so re-enabling");
    }else{
        console.log("[LifecycleEventsStrategy] App ("+app.getKey()+") has been installed but was previously disabled, so not enabling automatically");
    }
    
}

/**
 * @function log
 * @description Log Lifecycle transition state
 */
function logAppInstallStarted(payload){
    "use strict";
    const app = payload.app;
    const state = payload.type;
    console.log("[LifecycleEventsStrategy] App ("+app.getKey()+") state is : ", state);
}

module.exports = {
    logAppInstallStarted,
    enableAppOnLoad
};