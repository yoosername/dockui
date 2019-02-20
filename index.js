
const ApiModule = require("./src/app/module/impl/ApiModule");
const ApiModuleDescriptor = require("./src/app/descriptor/impl/ApiModuleDescriptor");
const ApiModuleLoader = require("./src/app/loader/impl/ApiModuleLoader");
const App = require("./src/app/App");
const AppDescriptor = require("./src/app/descriptor/AppDescriptor");
const AppLoader = require("./src/app/loader/AppLoader");
const AppPermission = require("./src/app/permission/AppPermission");
const AppService = require("./src/app/service/AppService");
const AppStore = require("./src/store/AppStore");
const AuthenticationProviderModule = require("./src/app/module/impl/AuthenticationProviderModule");
const AuthenticationProviderModuleDescriptor = require("./src/app/descriptor/impl/AuthenticationProviderModuleDescriptor");
const AuthenticationProviderModuleLoader = require("./src/app/loader/impl/AuthenticationProviderModuleLoader");
const AuthorizationProviderModule = require("./src/app/module/impl/AuthorizationProviderModule");
const AuthorizationProviderModuleDescriptor = require("./src/app/descriptor/impl/AuthorizationProviderModuleDescriptor");
const AuthorizationProviderModuleLoader = require("./src/app/loader/impl/AuthorizationProviderModuleLoader");
const CachableModuleLoader = require("./src/app/loader/impl/CachableModuleLoader");
const DockUIApps = require("./src/app/DockUIApps");
const DockerEventsDelegatingAppLoader = require("./src/app/loader/impl/DockerEventsDelegatingAppLoader");
const EventService = require("./src/events/EventService");
const HttpClient = require("./src/app/http/HttpClient");
const InMemoryAppStore = require("./src/store/impl/InMemoryAppStore");
const LifecycleEventsStrategy = require("./src/events/strategy/LifecycleEventsStrategy");
const MockDockerClient = require("./src/util/MockDockerClient");
const Module = require("./src/app/module/Module");
const ModuleDescriptor = require("./src/app/descriptor/ModuleDescriptor");
const ModuleLoader = require("./src/app/loader/ModuleLoader");
const RouteModule = require("./src/app/module/impl/RouteModule");
const RouteModuleDescriptor = require("./src/app/descriptor/impl/RouteModuleDescriptor");
const RouteModuleLoader = require("./src/app/loader/impl/RouteModuleLoader");
const SecurityContext = require("./src/app/security/SecurityContext");
const UrlAppLoader = require("./src/app/loader/impl/UrlAppLoader");
const WebFragmentModule = require("./src/app/module/impl/WebFragmentModule");
const WebFragmentModuleDescriptor = require("./src/app/descriptor/impl/WebFragmentModuleDescriptor");
const WebFragmentModuleLoader = require("./src/app/loader/impl/WebFragmentModuleLoader");
const WebItemModule = require("./src/app/module/impl/WebItemModule");
const WebItemModuleDescriptor = require("./src/app/descriptor/impl/WebItemModuleDescriptor");
const WebItemModuleLoader = require("./src/app/loader/impl/WebItemModuleLoader");
const WebPageModule = require("./src/app/module/impl/WebPageModule");
const WebPageModuleDescriptor = require("./src/app/descriptor/impl/WebPageModuleDescriptor");
const WebPageModuleLoader = require("./src/app/loader/impl/WebPageModuleLoader");
const WebResourceModule = require("./src/app/module/impl/WebResourceModule");
const WebResourceModuleDescriptor = require("./src/app/descriptor/impl/WebResourceModuleDescriptor");
const WebResourceModuleLoader = require("./src/app/loader/impl/WebResourceModuleLoader");
const WebService = require("./src/web/WebService");
const WebhookModule = require("./src/app/module/impl/WebhookModule");
const WebhookModuleDescriptor = require("./src/app/descriptor/impl/WebhookModuleDescriptor");
const WebhookModuleLoader = require("./src/app/loader/impl/WebhookModuleLoader");
const errors = require("./src/constants/errors");
const events = require("./src/constants/events");
const helper = require("./src/events/strategy/helper");
const mocks = require("./src/util/mocks");
const validate = require("./src/util/validate");


module.exports = {
App,
DockUIApps,
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
HttpClient,
AppLoader,
ModuleLoader,
ApiModuleLoader,
AuthenticationProviderModuleLoader,
AuthorizationProviderModuleLoader,
CachableModuleLoader,
DockerEventsDelegatingAppLoader,
RouteModuleLoader,
UrlAppLoader,
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
SecurityContext,
AppService,
errors,
events,
EventService,
LifecycleEventsStrategy,
helper,
AppStore,
InMemoryAppStore,
MockDockerClient,
mocks,
validate,
WebService,
}


// TODO: Standardize the logging output format. 
//       Do it 12 factor style. Aka log to STDOUT, 
//       but allow customization of verbosity