
const ApiModule = require("./src/app/module/impl/ApiModule");
const ApiModuleLoader = require("./src/app/loader/module/impl/ApiModuleLoader");
const App = require("./src/app/App");
const AppLoadWorker = require("./src/task/worker/impl/AppLoadWorker");
const AppLoader = require("./src/app/loader/AppLoader");
const AppReloadWorker = require("./src/task/worker/impl/AppReloadWorker");
const AppService = require("./src/app/service/AppService");
const AppServiceFactory = require("./src/app/service/factory/AppServiceFactory");
const AppStateWorker = require("./src/task/worker/impl/AppStateWorker");
const AppStore = require("./src/store/AppStore");
const AppUnLoadWorker = require("./src/task/worker/impl/AppUnLoadWorker");
const AuthenticationProviderModule = require("./src/app/module/impl/AuthenticationProviderModule");
const AuthenticationProviderModuleLoader = require("./src/app/loader/module/impl/AuthenticationProviderModuleLoader");
const AuthorizationProviderModule = require("./src/app/module/impl/AuthorizationProviderModule");
const AuthorizationProviderModuleLoader = require("./src/app/loader/module/impl/AuthorizationProviderModuleLoader");
const CLI = require("./src/cli/CLI");
const ConfigLoader = require("./src/config/loader/ConfigLoader");
const DockerEventsReactor = require("./src/task/reactor/impl/DockerEventsReactor");
const EnvConfigLoader = require("./src/config/loader/impl/EnvConfigLoader");
const InMemoryAppStore = require("./src/store/impl/InMemoryAppStore");
const Instance = require("./src/Instance");
const Logger = require("./src/log/Logger");
const LoggerFactory = require("./src/log/factory/LoggerFactory");
const LokiAppStore = require("./src/store/impl/LokiAppStore");
const Module = require("./src/app/module/Module");
const ModuleFactory = require("./src/app/module/factory/ModuleFactory");
const ModuleLoader = require("./src/app/loader/module/ModuleLoader");
const ModuleStateWorker = require("./src/task/worker/impl/ModuleStateWorker");
const Reactor = require("./src/task/reactor/Reactor");
const RouteModule = require("./src/app/module/impl/RouteModule");
const RouteModuleLoader = require("./src/app/loader/module/impl/RouteModuleLoader");
const SimpleAppService = require("./src/app/service/impl/SimpleAppService");
const SimpleKoaWebService = require("./src/web/impl/SimpleKoaWebService");
const SingleNodeTaskManager = require("./src/task/manager/impl/SingleNodeTaskManager");
const StandardInstance = require("./src/StandardInstance");
const StoreFactory = require("./src/store/factory/StoreFactory");
const Task = require("./src/task/Task");
const TaskManager = require("./src/task/manager/TaskManager");
const TaskManagerFactory = require("./src/task/manager/factory/TaskManagerFactory");
const TaskWorker = require("./src/task/worker/TaskWorker");
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
const WinstonLogger = require("./src/log/impl/WinstonLogger");
const addPageFragments = require("./src/web/impl/middleware/addPageFragments");
const addPageItems = require("./src/web/impl/middleware/addPageItems");
const addResourcesFromContext = require("./src/web/impl/middleware/addResourcesFromContext");
const addResourcesToContext = require("./src/web/impl/middleware/addResourcesToContext");
const authenticationHandler = require("./src/web/impl/middleware/authenticationHandler");
const cacheHandler = require("./src/web/impl/middleware/cacheHandler");
const decoratePage = require("./src/web/impl/middleware/decoratePage");
const detectModule = require("./src/web/impl/middleware/detectModule");
const disableApp = require("./src/cli/commands/disableApp");
const disableModule = require("./src/cli/commands/disableModule");
const enableApp = require("./src/cli/commands/enableApp");
const enableModule = require("./src/cli/commands/enableModule");
const fetchPage = require("./src/web/impl/middleware/fetchPage");
const idamDecorator = require("./src/web/impl/middleware/idamDecorator");
const index = require("./src/util/index");
const listApps = require("./src/cli/commands/listApps");
const listModules = require("./src/cli/commands/listModules");
const listTasks = require("./src/cli/commands/listTasks");
const loadApp = require("./src/cli/commands/loadApp");
const policyDecisionPoint = require("./src/web/impl/middleware/policyDecisionPoint");
const reloadApp = require("./src/cli/commands/reloadApp");
const routeHandler = require("./src/web/impl/middleware/routeHandler");
const serveIfApi = require("./src/web/impl/middleware/serveIfApi");
const serveIfWebPage = require("./src/web/impl/middleware/serveIfWebPage");
const serveIfWebResource = require("./src/web/impl/middleware/serveIfWebResource");
const setupDockUI = require("./src/web/impl/middleware/setupDockUI");
const unloadApp = require("./src/cli/commands/unloadApp");
const {Config} = require("./src/config/Config");


module.exports = {
Instance,
StandardInstance,
App,
AppLoader,
ModuleLoader,
ApiModuleLoader,
AuthenticationProviderModuleLoader,
AuthorizationProviderModuleLoader,
RouteModuleLoader,
WebFragmentModuleLoader,
WebItemModuleLoader,
WebPageModuleLoader,
WebResourceModuleLoader,
WebhookModuleLoader,
Module,
ModuleFactory,
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
SimpleAppService,
CLI,
disableApp,
disableModule,
enableApp,
enableModule,
listApps,
listModules,
listTasks,
loadApp,
reloadApp,
unloadApp,
Config,
ConfigLoader,
EnvConfigLoader,
Logger,
LoggerFactory,
WinstonLogger,
AppStore,
StoreFactory,
InMemoryAppStore,
LokiAppStore,
Task,
TaskManager,
TaskManagerFactory,
SingleNodeTaskManager,
Reactor,
DockerEventsReactor,
TaskWorker,
AppLoadWorker,
AppReloadWorker,
AppStateWorker,
AppUnLoadWorker,
ModuleStateWorker,
index,
WebService,
WebServiceFactory,
SimpleKoaWebService,
addPageFragments,
addPageItems,
addResourcesFromContext,
addResourcesToContext,
authenticationHandler,
cacheHandler,
decoratePage,
detectModule,
fetchPage,
idamDecorator,
policyDecisionPoint,
routeHandler,
serveIfApi,
serveIfWebPage,
serveIfWebResource,
setupDockUI,
}
