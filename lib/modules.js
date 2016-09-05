var decorators = {};

decorators["webitem"] = require("./decorators/WebItem");

function getDecoratorFactory(type){

  return {
    instanceOf : function(instance){
      var decorator = decorators[type];
      //console.log("typeof ", decorator, " is ", typeof( decorator ));
      if( decorator != null && typeof decorator == "function") return new decorator(instance);
      return null;
    }
  }

}

exports.getDecoratorFactory = getDecoratorFactory;
