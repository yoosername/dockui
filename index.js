const SecurityContext = require("./src/app/security/SecurityContext");
const WebResourceModule = require("./src/app/module/impl/WebResourceModule");
const RouteModule = require("./src/app/module/impl/RouteModule");
const AuthenticationProviderModule = require("./src/app/module/impl/AuthenticationProviderModule");
const WebhookModule = require("./src/app/module/impl/WebhookModule");
const WebPageModule = require("./src/app/module/impl/WebPageModule");
const ApiModule = require("./src/app/module/impl/ApiModule");
const WebItemModule = require("./src/app/module/impl/WebItemModule");
const AuthorizationProviderModule = require("./src/app/module/impl/AuthorizationProviderModule");
const WebFragmentModule = require("./src/app/module/impl/WebFragmentModule");
const Module = require("./src/app/module/Module");
const DockUIApps = require("./src/app/DockUIApps");
const AuthenticationProviderModuleLoader = require("./src/app/loader/impl/AuthenticationProviderModuleLoader");
const WebFragmentModuleLoader = require("./src/app/loader/impl/WebFragmentModuleLoader");
const WebPageModuleLoader = require("./src/app/loader/impl/WebPageModuleLoader");
const WebhookModuleLoader = require("./src/app/loader/impl/WebhookModuleLoader");
const CachableModuleLoader = require("./src/app/loader/impl/CachableModuleLoader");
const UrlAppLoader = require("./src/app/loader/impl/UrlAppLoader");
const AuthorizationProviderModuleLoader = require("./src/app/loader/impl/AuthorizationProviderModuleLoader");
const RouteModuleLoader = require("./src/app/loader/impl/RouteModuleLoader");
const WebResourceModuleLoader = require("./src/app/loader/impl/WebResourceModuleLoader");
const ApiModuleLoader = require("./src/app/loader/impl/ApiModuleLoader");
const DockerEventsDelegatingAppLoader = require("./src/app/loader/impl/DockerEventsDelegatingAppLoader");
const WebItemModuleLoader = require("./src/app/loader/impl/WebItemModuleLoader");
const AppLoader = require("./src/app/loader/AppLoader");
const ModuleLoader = require("./src/app/loader/ModuleLoader");
const HttpClient = require("./src/app/http/HttpClient");
const RouteModuleDescriptor = require("./src/app/descriptor/impl/RouteModuleDescriptor");
const ApiModuleDescriptor = require("./src/app/descriptor/impl/ApiModuleDescriptor");
const WebResourceModuleDescriptor = require("./src/app/descriptor/impl/WebResourceModuleDescriptor");
const WebhookModuleDescriptor = require("./src/app/descriptor/impl/WebhookModuleDescriptor");
const AuthenticationProviderModuleDescriptor = require("./src/app/descriptor/impl/AuthenticationProviderModuleDescriptor");
const AuthorizationProviderModuleDescriptor = require("./src/app/descriptor/impl/AuthorizationProviderModuleDescriptor");
const WebItemModuleDescriptor = require("./src/app/descriptor/impl/WebItemModuleDescriptor");
const WebFragmentModuleDescriptor = require("./src/app/descriptor/impl/WebFragmentModuleDescriptor");
const WebPageModuleDescriptor = require("./src/app/descriptor/impl/WebPageModuleDescriptor");
const AppDescriptor = require("./src/app/descriptor/AppDescriptor");
const ModuleDescriptor = require("./src/app/descriptor/ModuleDescriptor");
const AppService = require("./src/app/service/AppService");
const AppPermission = require("./src/app/permission/AppPermission");
const App = require("./src/app/App");
const mocks = require("./src/util/mocks");
const MockDockerClient = require("./src/util/MockDockerClient");
const validate = require("./src/util/validate");
const WebService = require("./src/web/WebService");
const events = require("./src/constants/events");
const errors = require("./src/constants/errors");
const EventService = require("./src/events/EventService");
const LifecycleEventsStrategy = require("./src/events/strategy/LifecycleEventsStrategy");
const helper = require("./src/events/strategy/helper");
const InMemoryAppStore = require("./src/store/impl/InMemoryAppStore");
const AppStore = require("./src/store/AppStore");


module.exports = {
SecurityContext,
WebResourceModule,
RouteModule,
AuthenticationProviderModule,
WebhookModule,
WebPageModule,
ApiModule,
WebItemModule,
AuthorizationProviderModule,
WebFragmentModule,
Module,
DockUIApps,
AuthenticationProviderModuleLoader,
WebFragmentModuleLoader,
WebPageModuleLoader,
WebhookModuleLoader,
CachableModuleLoader,
UrlAppLoader,
AuthorizationProviderModuleLoader,
RouteModuleLoader,
WebResourceModuleLoader,
ApiModuleLoader,
DockerEventsDelegatingAppLoader,
WebItemModuleLoader,
AppLoader,
ModuleLoader,
HttpClient,
RouteModuleDescriptor,
ApiModuleDescriptor,
WebResourceModuleDescriptor,
WebhookModuleDescriptor,
AuthenticationProviderModuleDescriptor,
AuthorizationProviderModuleDescriptor,
WebItemModuleDescriptor,
WebFragmentModuleDescriptor,
WebPageModuleDescriptor,
AppDescriptor,
ModuleDescriptor,
AppService,
AppPermission,
App,
mocks,
MockDockerClient,
validate,
WebService,
events,
errors,
EventService,
LifecycleEventsStrategy,
helper,
InMemoryAppStore,
AppStore,
}
