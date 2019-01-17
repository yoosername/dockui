const  {
    ShapeValidationError
} = require("../constants/errors");

const Shapes = Object.freeze(
    {
        "EventService":[
            "on","emit","addListener","removeListener"
        ], 
        "AppService":[
            "start","shutdown","scanForNewApps","stopScanningForNewApps",
            "getApps","getApp","enableApp","disableApp",
            "getModules","getModule","enableModule","disableModule"
        ], 
        "AppLoader":[
            "scanForNewApps","stopScanningForNewApps","addApp","removeApp",
            "getApps","getApp"
        ],
        "App":[
            "getKey","getType","getUrl","getUUID","getPermission","getLoader","getDescriptor","getEventService",
            "getModuleLoaders","enable","disable","loadModules"
        ],
        "AppDescriptor":[
            "getName","getKey","getType","getUrl","getDescription","getVersion",
            "getDescriptorVersion","getIcon","getLifecycle","getAuthentication",
            "getModules"
        ],
        "AppHttpClient":[
            "get","post"
        ],
        "ModuleDescriptor":[
            "getType","getKey","getName","getCache","getRoles"
        ],
        "ModuleLoader":[
            "canLoadModuleDescriptor","loadModuleFromDescriptor",
            "getCache","setCache"
        ],
        "Module":[
            "getKey","getType","enable","disable"
        ],
        "LifecycleEventsStrategy":[
            "setup","teardown"
        ], 
        "AppStore":[
            "set","get","delete"
        ],
        "WebService":[
            "start","stop"
        ]
    }
);

/**
 * @description Check if the object has desired shape
 * @ignore
 */
function validateShape(shape, object){
    "use strict";
    if(!shape) {
        throw new ShapeValidationError("[validateShape] shape ("+shape+") - object ("+object+") is null or undefined");
    }
    if(!object) {
        throw new ShapeValidationError("[validateShape] shape ("+shape+") - object ("+object+") is null or undefined");
    }
    if(Shapes.hasOwnProperty(shape)){
        Shapes[shape].forEach(prop => {
            if(!object.hasOwnProperty(prop)){
                throw new ShapeValidationError("[validateShape] shape ("+shape+") - object ("+object+") is not the required shape ("+Shapes[shape]+")");
            }
        });
    }else{
        throw new ShapeValidationError("[validateShape] shape ("+shape+") - object ("+object+") is unknown type, cant test it");
    }
    
}

/**
 * @description Check we are working with the right objects or throw
 * @ignore
 */
function validateShapes(shapeArray){
    "use strict";
    shapeArray.forEach(testable =>{
        validateShape(testable.shape,testable.object);
    });
}

module.exports = {
    validateShape,
    validateShapes
};