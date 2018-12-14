const  {
    ShapeValidationError
} = require("../constants/errors");

const Shapes = Object.freeze(
    {
        "EventService":[
            "on","trigger","addListener","removeListener"
        ], 
        "AppService":[
            "start","shutdown","scanForNewApps","stopScanningForNewApps",
            "getApps","getApp","enableApp","disableApp",
            "getModules","getModule","enableModule","disableModule"
        ], 
        "AppLoader":[
            "scanForNewApps","stopScanningForNewApps","getApps","getApp",
            "enableApp","disableApp","getModules","enableModule",
            "disableModule"
        ],
        "App":[
            "getKey","getAppLoader","getAppDescriptor","getEventService",
            "getModuleLoaders","enable","disable","registerModules"
        ],
        "AppDescriptor":[
            "getName","getAppKey","getVersion","getVersion","getIcon",
            "getModules"
        ],
        "ModuleDescriptor":[
            "getType","getKey","getData"
        ],
        "ModuleLoader":[
            "canLoadModuleDescriptor","loadModuleFromDescriptor"
        ],
        "Module":[
            "getKey","getType","enable","disable"
        ],
        "LifecycleEventsStrategy":[
            "setup","teardown"
        ], 
        "AppStore":[
            "set","get","enableApp","disableApp",
            "enableModule","disableModule"
        ],
        "WebService":[
            "start","stop"
        ]
    }
);

/**
 * @function validateShape
 * @description Check if the object has desired shape
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
 * @function validateShapes
 * @description Check we are working with the right objects or throw
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