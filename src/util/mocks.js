const MockAppService = function(){
    "use strict";
    return { 
        "start": function () {},
        "shutdown": function () {},
        "scanForNewApps": function () {},
        "stopScanningForNewApps": function () {},
        "getApps": function () {},
        "getApp": function () {},
        "enableApp": function () {},
        "disableApp": function () {},
        "getModules": function () {},
        "getModule": function () {},
        "enableModule": function () {},
        "disableModule": function () {}
    };
};
const MockAppLoader = function(){
    "use strict";
    return { 
        scanForNewApps: function () {},
        stopScanningForNewApps: function () {},
        getApps: function(){},
        getApp: function(){}
    };
};
const MockAppLoaders = function(loader){
    "use strict";
    return [
        Object.assign({},(loader)?loader:new MockAppLoader()),
        Object.assign({},(loader)?loader:new MockAppLoader()),
        Object.assign({},(loader)?loader:new MockAppLoader())
    ];
};
const MockAppStore = function(){ 
    "use strict";
    return {
        get: function () {}, 
        set: function () {},
        delete: function () {}
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
        emit: function () {}, 
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
        getModuleLoaders: function () {}, 
        enable: function () {}, 
        disable: function () {}, 
        registerModules: function () {}
    };
};
const MockModule = function(){
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
const MockModuleDescriptor = function(){
    "use strict";
    return {
        type:  "mockModuleType",
        key: "mockModuleKey",
        name: "mockModuleName"
    };
};

module.exports = {
    MockAppService,
    MockAppLoader,
    MockAppLoaders,
    MockAppStore,
    MockLifecycleEventsStrategy,
    MockEventService,
    MockApp,
    MockModule,
    MockAppDescriptor,
    MockModuleDescriptor
};