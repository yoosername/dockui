const MockLoader = function(){
    "use strict";
    return { 
        scanForNewApps: function () {},
        stopScanningForNewApps: function () {},
        getApps: function(){},
        enableApp: function(){},
        disableApp: function(){},
        getAppModules: function(){},
        enableAppModule: function(){},
        disableAppModule: function(){}
    };
};
const MockLoaders = function(loader){
    "use strict";
    return [
        Object.assign({},(loader)?loader:new MockLoader()),
        Object.assign({},(loader)?loader:new MockLoader()),
        Object.assign({},(loader)?loader:new MockLoader())
    ];
};
const MockAppStore = function(){ 
    "use strict";
    return {
        get: function () {}, 
        set: function () {},
        enableApp: function(){},
        disableApp: function(){},
        enableAppModule: function(){},
        disableAppModule: function(){}
    };
};
const MockLifecycleEventsStrategy = function(){
    "use strict";
    return {
        setup: function () {},
        teardown: function () {}
    };
};
const MockEventService = function(){ 
    "use strict";
    return {
        on: function () {}, 
        trigger: function () {}, 
        addListener: function(){},
        removeListener: function () {} 
    };
};
const MockApp = function(){
    "use strict";
    return {
        getKey: function () {},
        getAppLoader: function () {},
        getAppDescriptor: function () {},
        getEventService: function () {},
        getAppModuleLoaders: function () {}, 
        enable: function () {}, 
        disable: function () {}, 
        registerAppModules: function () {}
    };
};
const MockAppModule = function(){
    "use strict";
    return {
        getKey: function () {}, 
        getType: function(){},
        enable: function () {}, 
        disable: function () {}
    };
};
const MockAppDescriptor = function(){
    "use strict";
    return {
        getName: function () {}, 
        getKey: function () {}, 
        getVersion: function () {}, 
        getDescriptorVersion: function () {}, 
        getIcon: function () {}, 
        getModules: function () {}
    };
};
const MockAppModuleDescriptor = function(){
    "use strict";
    return {
        getType: function () {},
        getKey: function () {}, 
        getData: function () {}
    };
};

module.exports = {
    MockLoader,
    MockLoaders,
    MockAppStore,
    MockLifecycleEventsStrategy,
    MockEventService,
    MockApp,
    MockAppModule,
    MockAppDescriptor,
    MockAppModuleDescriptor
};