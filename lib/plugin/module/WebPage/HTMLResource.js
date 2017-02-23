var types = require("./HTMLResourceTypes");
let cheerio = require('cheerio');
const uuidV4 = require('uuid/v4');

class HTMLResource{

  constructor({
    type = null,
    key = null,
    dependencies = [],
    weight = 100,
    body = null,
    ref = null,
    params = [],
    isDecoratorResource = false
  }){
    this.type = type;
    this.key = key;
    this.dependencies = dependencies;
    this.weight = weight;
    this.body = body;
    this.ref = ref;
    this.params = params;
    this.isDecoratorResource = isDecoratorResource;
  }

  getType(){
    return this.type;
  }

  getKey(){
    return this.key;
  }

  getDependencies(){
    return this.dependencies;
  }

  getWeight(){
    return this.weight;
  }

  getBody(){
    return this.body;
  }

  getRef(){
    return this.ref;
  }

  getParams(){
    return this.params;
  }

  getParamsAsString(){
    if(this.params && this.params.length > 0){
      return this.params.join(",");
    }else{
      return "";
    }
  }

  isDecoratorResource(){
    return this.isDecoratorResource;
  }

  parseHtml(html){
    var $;

    try{
      $ = cheerio.load(html);
    }catch(error){
      console.log("couldnt parse html: ", html, " - error: ", error);
      return;
    }

    var type = null, tag = null;
    if( $('link').length && $('link')[0].name == 'link' ){
      type = types.EXTERNAL_STYLE;
      tag = 'link';
    }
    else if($('style').length && $('style')[0].name == 'style'){
      type = types.INLINE_STYLE;
      tag = 'style';
    }
    else if($('script').length && $('script')[0].name == 'script' && ! $('script').attr('src')){
      type = types.INLINE_SCRIPT;
      tag = 'script';
    }
    else if($('script').length && $('script')[0].name == 'script' && $('script').attr('src')){
      type = types.EXTERNAL_SCRIPT;
      tag = 'script';
    }

    if( type == null ){
      console.log("Couldnt parse Resource HTML: Not a valid type of (link, style, script)");
      return;
    }

    this.type = type;
    this.key = $(tag).attr("key") || uuidV4();
    this.dependencies = $(tag).attr("requires") || [];
    this.weight = $(tag).attr("weight") || 100;

    if( type == types.INLINE_SCRIPT || type == types.INLINE_STYLE ){
      this.body = $(tag).html();
    }else if( type == types.EXTERNAL_SCRIPT ){
      this.ref = $(tag).attr("src");
    }else if( type == types.EXTERNAL_STYLE ){
      this.ref = $(tag).attr("href");
    }

    //console.log("NODE IS TYPE: ", this.json());

  }

  json(){
    return {
      "type" : this.type,
      "key" : this.key,
      "dependencies" : this.dependencies,
      "weight" : this.weight,
      "body" : this.body,
      "ref" : this.ref,
      "params" : this.params,
      "isDecoratorResource" : this.isDecoratorResource
    };
  }

  html(){
    if( this.type ){

      switch( this.type ){
        case types.INLINE_STYLE:
          var tmpl = `<style type='text/css' ${this.getParamsAsString()}>${this.body}</style>`;
          return tmpl;

        case types.INLINE_SCRIPT:
          var tmpl = `<script type='text/javascript' ${this.getParamsAsString()}>${this.body}</script>`;
          return tmpl;

        case types.EXTERNAL_STYLE:
          var tmpl = `<link rel='stylesheet' href='${this.ref}' ${this.getParamsAsString()}>`;
          return tmpl;

        case types.EXTERNAL_SCRIPT:
          var tmpl = `<script type='text/javascript' src='${this.ref}' ${this.getParamsAsString()}>`;
          return tmpl;
      }

    }else{
      console.log("Resource has no type, cant transform into HTML: ", this.json());
    }
  }

}

module.exports = HTMLResource;
