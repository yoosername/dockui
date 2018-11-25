const  {
    ShapeValidationError
} = require("../constants/errors");

const Shapes = Object.freeze(
    {
        "EventService":[
            "on","trigger","addListener","removeListener"
        ], 
        "PluginService":[
            "start","shutdown","scanForNewPlugins","stopScanningForNewPlugins",
            "getPlugins","getPlugin","enablePlugin","disablePlugin",
            "getPluginModules","getPluginModule","enablePluginModule","disablePluginModule"
        ], 
        "PluginLoader":[
            "scanForNewPlugins","stopScanningForNewPlugins","getPlugins",
            "enablePlugin","disablePlugin","getPluginModules","enablePluginModule",
            "disablePluginModule"
        ],
        "Plugin":[
            "getKey","getPluginLoader","getPluginDescriptor","getEventService",
            "getPluginModuleLoaders","enable","disable","registerPluginModules"
        ],
        "PluginDescriptor":[
            "getName","getPluginKey","getVersion","getVersion","getIcon",
            "getModules"
        ],
        "PluginModuleDescriptor":[
            "getType","getKey","getData"
        ],
        "PluginModuleLoader":[
            "canLoadModuleDescriptor","loadModuleFromDescriptor"
        ],
        "PluginModule":[
            "getKey","getType","enable","disable"
        ],
        "LifecycleEventsStrategy":[
            "setup","teardown"
        ], 
        "PluginStore":[
            "set","get","enablePlugin","disablePlugin",
            "enablePluginModule","disablePluginModule"
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