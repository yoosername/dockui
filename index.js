const ApiModule = require("./src/app/module/impl/ApiModule");
const ApiModuleLoader = require("./src/app/loader/module/impl/ApiModuleLoader");
const App = require("./src/app/App");
const AppLoader = require("./src/app/loader/AppLoader");
const AppLoaderTaskWorker = require("./src/task/worker/impl/AppLoadWorker");
const AppService = require("./src/app/service/AppService");
const AppServiceFactory = require("./src/app/service/factory/AppServiceFactory");
const AppStore = require("./src/store/AppStore");
const AuthenticationProviderModule = require("./src/app/module/impl/AuthenticationProviderModule");
const AuthenticationProviderModuleLoader = require("./src/app/loader/module/impl/AuthenticationProviderModuleLoader");
const AuthorizationProviderModule = require("./src/app/module/impl/AuthorizationProviderModule");
const AuthorizationProviderModuleLoader = require("./src/app/loader/module/impl/AuthorizationProviderModuleLoader");
const CLI = require("./src/cli/CLI");
const CachableModuleLoader = require("./src/app/loader/module/impl/CachableModuleLoader");
const Config = require("./src/config/Config");
const ConfigDefaults = require("./src/config/ConfigDefaults");
const ConfigEnvLoader = require("./src/config/ConfigEnvLoader");
const ConfigLoader = require("./src/config/ConfigLoader");
const DefaultAppService = require("./src/app/service/impl/DefaultAppService");
const DockUI = require("./src/main/Instance");
const DockerEventsReactor = require("./src/task/reactor/impl/DockerEventsReactor");
const InMemoryAppStore = require("./src/store/impl/InMemoryAppStore");
const InstanceBuilder = require("./src/InstanceBuilder");
const Module = require("./src/app/module/Module");
const ModuleLoader = require("./src/app/loader/module/ModuleLoader");
const Reactor = require("./src/task/reactor/Reactor");
const RouteModule = require("./src/app/module/impl/RouteModule");
const RouteModuleLoader = require("./src/app/loader/module/impl/RouteModuleLoader");
const SimpleWebService = require("./src/web/impl/SimpleWebService");
const SingleNodeTaskManager = require("./src/task/manager/impl/SingleNodeTaskManager");
const StoreFactory = require("./src/store/factory/StoreFactory");
const TaskManager = require("./src/task/manager/TaskManager");
const TaskManagerFactory = require("./src/task/manager/factory/TaskManagerFactory");
const TaskWorker = require("./src/task/worker/TaskWorker");
const UrlAppLoader = require("./src/app/loader/impl/UrlAppLoader");
const WebFragmentModule = require("./src/app/module/impl/WebFragmentModule");
const WebFragmentModuleLoader = require("./src/app/loader/module/impl/WebFragmentModuleLoader");
const WebItemModule = require("./src/app/module/impl/WebItemModule");
const WebItemModuleLoader = require("./src/app/loader/module/impl/WebItemModuleLoader");
const WebPageModule = require("./src/app/module/impl/WebPageModule");
const WebPageModuleLoader = require("./src/app/loader/module/impl/WebPageModuleLoader");
const WebResourceModule = require("./src/app/module/impl/WebResourceModule");
const WebResourceModuleLoader = require("./src/app/loader/module/impl/WebResourceModuleLoader");
const WebService = require("./src/web/WebService");
const WebServiceFactory = require("./src/web/factory/WebServiceFactory");
const WebhookModule = require("./src/app/module/impl/WebhookModule");
const WebhookModuleLoader = require("./src/app/loader/module/impl/WebhookModuleLoader");
const swagger = require("./src/web/impl/admin/swagger");

module.exports = {
  InstanceBuilder,
  App,
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
  AppService,
  AppServiceFactory,
  DefaultAppService,
  CLI,
  Config,
  ConfigDefaults,
  ConfigEnvLoader,
  ConfigLoader,
  DockUI,
  AppStore,
  StoreFactory,
  InMemoryAppStore,
  TaskManager,
  TaskManagerFactory,
  SingleNodeTaskManager,
  Reactor,
  DockerEventsReactor,
  TaskWorker,
  AppLoaderTaskWorker,
  WebService,
  WebServiceFactory,
  SimpleWebService,
  swagger
};
