const  {
  validateShapes
} = require("../../util/validate");

const axios = require("axios");

/**
 * @description Custom Client to perform communication over HTTP with a specific App
 */
class HttpClient{

  /**
   * @argument {App} app The Remote App.
   */
  constructor(
    app
  ){
    
    // Validate our args using ducktyping utils. (figure out better way to do this later)
    validateShapes([
      {"shape":"App","object":app}
    ]);

    this.app = app;

    const client = axios.create({
      baseURL: this.app.getUrl(),
      timeout: 1000,
      // transformRequest: [this.preSendHook],
      // transformResponse: [this.postReceiveHook]
    });

    var initializedClient = this.init(client);
    this._client = (initializedClient) ? initializedClient : client;

  }

  /**
   * @description Oppertunity for subclasses to configure the client before use
   * @argument {object} client The Http Client instance
   * @async
   */
  init(client){
    return client;
  }

  /**
   * @description perform a relative request against the Apps base URL
   * @argument {object} options The request options
   * @async
   */
  send(options){
    options = this.transformRequest(options);
    return this._client(options).then(this.transformResponse);
  }

  /**
   * @description perform a relative GET request against the Apps base URL
   * @argument {String} url - the URL to GET relative to the App
   * @argument {Object} options - optional request config
   * @async
   */
  get(url, options){
    options = (options) ? options : {};
    options = Object.assign(options, {
      method: 'get',
      url: url
    });
    return this.send(options);
  }

  /**
   * @description perform a GET request against the App
   * @argument {String} url - the URL to POST to relative to the App
   * @argument {Object} data - the data to Post to the App
   * @argument {Object} options - optional request config
   * @async
   */
  post(url, data, options){
    options = (options) ? options : {};
    options = Object.assign({},options, {
      method: 'post',
      url: url,
      data
    });
    return this.send(options);
  }

  /**
   * @argument {Object} options - The Request options prior to send
   */
  transformRequest(options){
    // subclasses should override this to modify request behaviour
    return options;
  }

  /**
   * @argument {Object} response - The raw response object post receive
   */
  transformResponse(response){
    // subclasses should override this to modify response behaviour
    return response;
  }


}

module.exports = HttpClient;