const Module = require("./Module");

class WebItem extends Module{

  constructor(descriptor){
    super(descriptor);

    this.link = descriptor.link;
    this.location = descriptor.location;
    this.weight = descriptor.weight;
    this.text = descriptor.text;
  }

  getLink(){
    return instance.link;
  }

  setLink(link){
    instance.link = link;
  }

  getLocation(){
    return instance.location;
  }

  setLocation(location){
    instance.location = location;
  }

  getWeight(){
    return instance.weight;
  }

  setWeight(weight){
    instance.weight = weight;
  }

  getText(){
    return instance.text;
  }

  setText(text){
    instance.text = text;
  }

}

module.exports = WebItem;
