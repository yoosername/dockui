var DepGraph = require('dependency-graph').DepGraph;
var types = require("./HTMLResourceTypes");

class HTMLResourceCollection{

  constructor(){
    this.resources = [];
  }

  addResource(resource){
    this.resources.push(resource);
  }

  getResources(search){

    if( search && typeof search === 'object' ){
      return this.resources.filter(function(resource){
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

  }

}

module.exports = HTMLResourceCollection;
