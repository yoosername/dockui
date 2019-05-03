
const ApiModule = require("./src/app/module/impl/ApiModule");
const ApiModuleDescriptor = require("./src/app/descriptor/impl/ApiModuleDescriptor");
const ApiModuleLoader = require("./src/app/loader/module/impl/ApiModuleLoader");
const App = require("./src/app/App");
const AppDescriptor = require("./src/app/descriptor/AppDescriptor");
const AppLoader = require("./src/app/loader/AppLoader");
const AppLoaderTaskWorker = require("./src/task/worker/impl/AppLoaderTaskWorker");
const AppPermission = require("./src/app/permission/AppPermission");
const AppService = require("./src/app/service/AppService");
const AppStore = require("./src/store/AppStore");
const AuthenticationProviderModule = require("./src/app/module/impl/AuthenticationProviderModule");
const AuthenticationProviderModuleDescriptor = require("./src/app/descriptor/impl/AuthenticationProviderModuleDescriptor");
const AuthenticationProviderModuleLoader = require("./src/app/loader/module/impl/AuthenticationProviderModuleLoader");
const AuthorizationProviderModule = require("./src/app/module/impl/AuthorizationProviderModule");
const AuthorizationProviderModuleDescriptor = require("./src/app/descriptor/impl/AuthorizationProviderModuleDescriptor");
const AuthorizationProviderModuleLoader = require("./src/app/loader/module/impl/AuthorizationProviderModuleLoader");
const CLI = require("./src/cli/CLI");
const CachableModuleLoader = require("./src/app/loader/module/impl/CachableModuleLoader");
const Config = require("./src/cli/Config");
const ConfigDefaults = require("./src/cli/ConfigDefaults");
const ConfigEnvLoader = require("./src/cli/ConfigEnvLoader");
const ConfigFileLoader = require("./src/cli/ConfigFileLoader");
const ConfigLoader = require("./src/cli/ConfigLoader");
const ConfigYAMLLoader = require("./src/cli/ConfigYAMLLoader");
const DefaultAppService = require("./src/app/service/impl/DefaultAppService");
const DefaultWebService = require("./src/web/impl/DefaultWebService");
const DockUIApps = require("./src/DockUIApps");
const InMemoryAppStore = require("./src/store/impl/InMemoryAppStore");
const Module = require("./src/app/module/Module");
const ModuleDescriptor = require("./src/app/descriptor/ModuleDescriptor");
const ModuleLoader = require("./src/app/loader/module/ModuleLoader");
const Reactor = require("./src/reactor/Reactor");
const RouteModule = require("./src/app/module/impl/RouteModule");
const RouteModuleDescriptor = require("./src/app/descriptor/impl/RouteModuleDescriptor");
const RouteModuleLoader = require("./src/app/loader/module/impl/RouteModuleLoader");
const SingleNodeTaskManager = require("./src/task/manager/impl/SingleNodeTaskManager");
const StoreFactory = require("./src/store/factory/StoreFactory");
const TaskManager = require("./src/task/manager/TaskManager");
const TaskManagerFactory = require("./src/task/manager/factory/TaskManagerFactory");
const TaskWorker = require("./src/task/worker/TaskWorker");
const UrlAppLoader = require("./src/app/loader/impl/UrlAppLoader");
const WebFragmentModule = require("./src/app/module/impl/WebFragmentModule");
const WebFragmentModuleDescriptor = require("./src/app/descriptor/impl/WebFragmentModuleDescriptor");
const WebFragmentModuleLoader = require("./src/app/loader/module/impl/WebFragmentModuleLoader");
const WebItemModule = require("./src/app/module/impl/WebItemModule");
const WebItemModuleDescriptor = require("./src/app/descriptor/impl/WebItemModuleDescriptor");
const WebItemModuleLoader = require("./src/app/loader/module/impl/WebItemModuleLoader");
const WebPageModule = require("./src/app/module/impl/WebPageModule");
const WebPageModuleDescriptor = require("./src/app/descriptor/impl/WebPageModuleDescriptor");
const WebPageModuleLoader = require("./src/app/loader/module/impl/WebPageModuleLoader");
const WebResourceModule = require("./src/app/module/impl/WebResourceModule");
const WebResourceModuleDescriptor = require("./src/app/descriptor/impl/WebResourceModuleDescriptor");
const WebResourceModuleLoader = require("./src/app/loader/module/impl/WebResourceModuleLoader");
const WebService = require("./src/web/WebService");
const WebhookModule = require("./src/app/module/impl/WebhookModule");
const WebhookModuleDescriptor = require("./src/app/descriptor/impl/WebhookModuleDescriptor");
const WebhookModuleLoader = require("./src/app/loader/module/impl/WebhookModuleLoader");
const muckingAbout = require("./src/cli/muckingAbout");
const swagger = require("./src/web/impl/admin/swagger");


module.exports = {
DockUIApps,
App,
AppDescriptor,
ModuleDescriptor,
ApiModuleDescriptor,
AuthenticationProviderModuleDescriptor,
AuthorizationProviderModuleDescriptor,
RouteModuleDescriptor,
WebFragmentModuleDescriptor,
WebItemModuleDescriptor,
WebPageModuleDescriptor,
WebResourceModuleDescriptor,
WebhookModuleDescriptor,
AppLoader,
UrlAppLoader,
ModuleLoader,
ApiModuleLoader,
AuthenticationProviderModuleLoader,
AuthorizationProviderModuleLoader,
CachableModuleLoader,
RouteModuleLoader,
WebFragmentModuleLoader,
WebItemModuleLoader,
WebPageModuleLoader,
WebResourceModuleLoader,
WebhookModuleLoader,
Module,
ApiModule,
AuthenticationProviderModule,
AuthorizationProviderModule,
RouteModule,
WebFragmentModule,
WebItemModule,
WebPageModule,
WebResourceModule,
WebhookModule,
AppPermission,
AppService,
DefaultAppService,
CLI,
Config,
ConfigDefaults,
ConfigEnvLoader,
ConfigFileLoader,
ConfigLoader,
ConfigYAMLLoader,
muckingAbout,
Reactor,
AppStore,
StoreFactory,
InMemoryAppStore,
TaskManager,
TaskManagerFactory,
SingleNodeTaskManager,
TaskWorker,
AppLoaderTaskWorker,
WebService,
DefaultWebService,
swagger,
}
