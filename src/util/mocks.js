const MockAppService = function() {
  "use strict";
  return {
    start: function() {},
    shutdown: function() {},
    scanForNewApps: function() {},
    stopScanningForNewApps: function() {},
    getApps: function() {},
    getApp: function() {},
    getModules: function() {},
    getModule: function() {}
  };
};
const MockAppLoader = function() {
  "use strict";
  return {
    scanForNewApps: function() {},
    stopScanningForNewApps: function() {},
    addApp: function() {},
    removeApp: function() {},
    getApps: function() {},
    getApp: function() {}
  };
};
const MockAppLoaders = function(loader) {
  "use strict";
  return [
    Object.assign({}, loader ? loader : new MockAppLoader()),
    Object.assign({}, loader ? loader : new MockAppLoader()),
    Object.assign({}, loader ? loader : new MockAppLoader())
  ];
};
const MockAppStore = function() {
  "use strict";
  return {
    get: function() {},
    set: function() {},
    delete: function() {},
    saveState: function() {},
    getState: function() {
      return { key: "", uuid: "", enabled: true, modules: [] };
    }
  };
};
const MockLifecycleEventsStrategy = function() {
  "use strict";
  return {
    setup: function() {},
    teardown: function() {}
  };
};
const MockEventService = function() {
  "use strict";
  return {
    on: function() {},
    emit: function() {},
    addListener: function() {},
    removeListener: function() {}
  };
};
const MockApp = function() {
  "use strict";
  return {
    getKey: function() {},
    getType: function() {},
    getUrl: function() {},
    getUUID: function() {},
    getPermission: function() {},
    getLoader: function() {},
    getDescriptor: function() {},
    getEventService: function() {},
    getModuleLoaders: function() {},
    getModules: function() {},
    getHttpClient: function() {},
    enable: function() {},
    disable: function() {},
    loadModules: function() {}
  };
};
const MockAppHttpClient = function() {
  "use strict";
  return {
    get: function() {},
    post: function() {}
  };
};
const MockModuleLoader = function() {
  "use strict";
  return {
    canLoadModuleDescriptor: function() {},
    loadModuleFromDescriptor: function() {},
    getCache: function() {},
    setCache: function() {}
  };
};
const MockModuleLoaders = function(loader) {
  "use strict";
  return [
    Object.assign({}, loader ? loader : new MockModuleLoader()),
    Object.assign({}, loader ? loader : new MockModuleLoader()),
    Object.assign({}, loader ? loader : new MockModuleLoader())
  ];
};
const MockModule = function() {
  "use strict";
  return {
    getKey: function() {},
    getType: function() {},
    enable: function() {},
    disable: function() {}
  };
};
const MockAppDescriptor = function() {
  "use strict";
  return {
    getName: function() {},
    getKey: function() {},
    getType: function() {},
    getUrl: function() {},
    getDescription: function() {},
    getVersion: function() {},
    getDescriptorVersion: function() {},
    getIcon: function() {},
    getLifecycle: function() {},
    getAuthentication: function() {},
    getModules: function() {
      return [];
    }
  };
};
const MockModuleDescriptor = function() {
  "use strict";
  return {
    getType: function() {
      return "mockModuleType";
    },
    getKey: function() {
      return "mockModuleKey";
    },
    getName: function() {
      return "mockModuleName";
    },
    getCache: function() {
      return { policy: "disabled" };
    },
    getRoles: function() {
      return [];
    }
  };
};
const MockWebService = function() {
  "use strict";
  return {
    start: function() {},
    shutdown: function() {}
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
  MockAppHttpClient,
  MockModuleLoader,
  MockModuleLoaders,
  MockModule,
  MockAppDescriptor,
  MockModuleDescriptor,
  MockWebService
};
