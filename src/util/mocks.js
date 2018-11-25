const MockLoader = function(){
    "use strict";
    return { 
        scanForNewPlugins: function () {},
        stopScanningForNewPlugins: function () {},
        getPlugins: function(){},
        enablePlugin: function(){},
        disablePlugin: function(){},
        getPluginModules: function(){},
        enablePluginModule: function(){},
        disablePluginModule: function(){}
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
const MockPluginStore = function(){ 
    "use strict";
    return {
        get: function () {}, 
        set: function () {},
        enablePlugin: function(){},
        disablePlugin: function(){},
        enablePluginModule: function(){},
        disablePluginModule: function(){}
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
const MockPlugin = function(){
    "use strict";
    return {
        getKey: function () {},
        getPluginLoader: function () {},
        getPluginDescriptor: function () {},
        getEventService: function () {},
        getPluginModuleLoaders: function () {}, 
        enable: function () {}, 
        disable: function () {}, 
        registerPluginModules: function () {}
    };
};
const MockPluginModule = function(){
    "use strict";
    return {
        getKey: function () {}, 
        getType: function(){},
        enable: function () {}, 
        disable: function () {}
    };
};
const MockPluginDescriptor = function(){
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
const MockPluginModuleDescriptor = function(){
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
    MockPluginStore,
    MockLifecycleEventsStrategy,
    MockEventService,
    MockPlugin,
    MockPluginModule,
    MockPluginDescriptor,
    MockPluginModuleDescriptor
};