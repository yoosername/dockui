const Module = require("./Module");

class WebItem extends Module{

  constructor(plugin, descriptor){
    super(plugin, descriptor);

    this.link = descriptor.link;
    this.location = descriptor.location;
    this.weight = parseInt(descriptor.weight) || 100;
    this.text = descriptor.text;
  }

  getLink(){
    return this.link;
  }

  setLink(link){
    this.link = link;
  }

  getLocation(){
    return this.location;
  }

  setLocation(location){
    this.location = location;
  }

  getWeight(){
    return this.weight;
  }

  setWeight(weight){
    this.weight = weight;
  }

  getText(){
    return this.text;
  }

  setText(text){
    this.text = text;
  }

  valid(){

    var validLink = (this.link && typeof this.link == "string");
    var validLocation = (this.location && typeof this.location == "string");
    var validText = (this.text && typeof this.text == "string");
    if( validLink && validLocation && validText && super.valid() ){
      return true;
    }
    return false;
  }

}

module.exports = WebItem;
