function WebItemDecorator(instance){
  this.instance = instance;
}

WebItemDecorator.prototype.decorate = function(data){
  this.instance.link = data.link;
  this.instance.location = data.location;
  this.instance.weight = data.weight;
  this.instance.text = data.text;

  this.instance.getLink = function(){
    return instance.link;
  }

  this.instance.setLink = function(link){
    instance.link = link;
  }

  this.instance.getLocation = function(){
    return instance.location;
  }

  this.instance.setLocation = function(location){
    instance.location = location;
  }

  this.instance.getWeight = function(){
    return instance.weight;
  }

  this.instance.setWeight = function(weight){
    instance.weight = weight;
  }

  this.instance.getText = function(){
    return instance.text;
  }

  this.instance.setText = function(text){
    instance.text = text;
  }

}

module.exports = WebItemDecorator;
