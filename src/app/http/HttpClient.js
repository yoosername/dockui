const  {
  validateShapes
} = require("../../util/validate");

const axios = require("axios");

/**
 * @class HttpClient
 * @description Custom Client to perform communication over HTTP with a specific App
 * @argument {App} app - The Remote App.
 */
class HttpClient{

  constructor(
    app
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"App","object":app}
    ]);

    const client = axios.create({
      baseURL: this.app.getUrl(),
      timeout: 1000,
      // transformRequest: [this.preSendHook],
      // transformResponse: [this.postReceiveHook]
    });

    this.init(client);
    this._client = client;

  }

  /**
   * @async
   * @method init
   * @argument {object} client - The Http Client instance
   * @description Oppertunity for subclasses to configure the client before use
   */
  init(client){
    return new Promise((resolve,reject)=>{
      // Subclasses should do setup tasks here.
      // e.g. modify default client options like:
      //   client.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      // e.g. do intial app handshake if using shared secrets etc
      resolve();
    });
  }

  /**
   * @method send
   * @async
   * @argument {object} options - The request options
   * @description perform a relative request against the Apps base URL
   */
  send(options){
    options = this.transformRequest(options);
    return this._client(options).then(this.transformResponse);
  }

  /**
   * @method get
   * @async
   * @argument {String} url - the URL to GET relative to the App
   * @argument {Object} options - optional request config
   * @description perform a relative GET request against the Apps base URL
   */
  get(url, options){
    options = Object.assign(options, {
      method: 'get',
      url: url
    });
    return this.send(options);
  }

  /**
   * @method post
   * @async
   * @argument {String} url - the URL to POST to relative to the App
   * @argument {Object} data - the data to Post to the App
   * @argument {Object} options - optional request config
   * @description perform a GET request against the App
   */
  post(url, data, options){
    options = Object.assign({},options, {
      method: 'post',
      url: url,
      data
    });
    return this.send(options);
  }

  /**
   * @method transformRequest
   * @argument {Object} options - The Request options prior to send
   */
  transformRequest(options){
    // subclasses should override this to modify request behaviour
    return options;
  }

  /**
   * @method transformResponse
   * @argument {Object} response - The raw response object post receive
   */
  transformResponse(response){
    // subclasses should override this to modify response behaviour
    return response;
  }


}

module.exports = HttpClient;