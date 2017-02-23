var DepGraph = require('dependency-graph').DepGraph;
var types = require("./HTMLResourceTypes");

var removeDuplicates = function(resources){

  var unique = {};
  var filteredResources = [];
  filteredResources = resources.filter(function(resource){
    var type = resource.getType();

    if( type == types.EXTERNAL_STYLE || type == types.EXTERNAL_SCRIPT ){

      var ref = resource.getRef();
      if(!unique[ref]){
        unique[ref] = ref;
        return true;
      }

    }else{
      return true;
    }

  });

  return filteredResources;


}

class HTMLResourceCollection{

  constructor(){
    this.resources = [];
  }

  addResource(resource){
    this.resources.push(resource);
  }

  getResources(search){

    var resources = this.resources;

    if( search && typeof search === 'object' ){
      resources = this.resources.filter(function(resource){
        var json = resource.json();
        var match = false;

        // For each property in the search object test for it
        Object.keys(search).forEach(key => {
          if(json[key] && json[key] === search[key]) {
              match = true;
          }
        })

        // If everything matched then dont filter it out
        if( match ) return true;
      })
    }

    resources = removeDuplicates(resources);

    return resources;

  }

}

module.exports = HTMLResourceCollection;
