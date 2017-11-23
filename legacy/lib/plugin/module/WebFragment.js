const Module = require("./Module");
var request = require('requestretry');
let cheerio = require('cheerio');

class WebFragment extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);
    this.path = descriptor.path;
    this.fragment = descriptor.fragment;
    this.location = descriptor.location;
    this.weight = descriptor.weight;
    this.cachedFragment = null;
    var self = this;

    this.fetchTemplate()
    .then(function(template){
      // Parse out the actual fragment we want and return it
      var $ = cheerio.load(template);
      var $fragment = $(self.getFragment());
      self.cachedFragment = $.html($fragment);
    });
  }

  getPath(){
    return this.path;
  }

  getLocation(){
    return this.location;
  }

  getFragment(){
    return this.fragment;
  }

  getWeight(){
    return this.weight;
  }

  fetchTemplate(){

    var plugin = this.getPlugin();
    var templateUrl = "http://" + plugin.getNetwork() + ":" + plugin.getPort() + this.getPath();

    return request({
      url: templateUrl,
      json:true,
      fullResponse: false // (default) To resolve the promise with the full response or just the body
    })

  }

  getCachedFragment(){
    return this.cachedFragment;
  }

  render(){
    return this.getCachedFragment();
  }

  valid(){

    var validPath = (this.path && typeof this.path == "string");
    var validFragment = (this.fragment && typeof this.fragment == "string");
    var validWeight = (this.weight && typeof this.weight == "integer");
    if( validPath && validFragment && validWeight && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = WebFragment;
