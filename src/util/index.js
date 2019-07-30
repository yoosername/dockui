const crypto = require("crypto");
const yaml = require("js-yaml");
const request = require("request");
const request_native = require("request-promise-native");
//const request = require("request-promise-native");

/**
 * @description  Wrap a Fetcher with some extra options derived from a DockUI Config
 * @argument {Config} config Config instance to load options from
 * @return {Function} Returns a decorated Fetch Function
 */
const configAwareFetcher = config => {
  let options = {};
  const cert = config.get ? config.get("web.ssl.cert") : null;
  const key = config.get ? config.get("web.ssl.key") : null;
  try {
    if (cert && cert !== "" && (key && key !== "")) {
      options.cert = fs.readFileSync(cert);
      options.key = fs.readFileSync(key);
      options.rejectUnauthorized = false;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    }
  } catch (err) {}
  const wrapper = (req, fetchOptions) => {
    let _req = fetchOptions ? req : null;
    let _fetchOptions = fetchOptions ? fetchOptions : req;
    const mergedOptions = Object.assign({}, options, _fetchOptions);
    if (_req) return fetch(_req, mergedOptions);
    return fetch(mergedOptions);
  };
  return wrapper;
};

/**
 * @description  Fetch some data from a URL
 * @argument {Object} req Optional Request Object to pipe in
 * @argument {Object} options Options to pass to Request
 * @return {Promise} Resolves to an object containing the raw response
 */
const fetch = async (req, options) => {
  let _req = options ? req : null;
  let _options = options ? options : req;

  return new Promise(function(resolve, reject) {
    try {
      // If Req then pipe it in
      if (_req) {
        _req.pipe(
          request(_options, (err, response, body) => {
            if (err) return reject(err);
            resolve(response);
          })
        );
      } else {
        // Otherwise just request it
        request(_options, (err, response, body) => {
          if (err) return reject(err);
          resolve(response);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @description  Fetch data from a URL and return response Body
 * @argument {Object} req Optional Request Object to pipe in
 * @argument {Object} options Options to pass to Request
 * @return {String} Raw Body of response (e.g. JSON or YAML)
 */
const fetchBody = async (req, options) => {
  try {
    const response = await fetch(req, options);
    return response.body;
  } catch (e) {
    throw new Error(
      `Error fetching Descriptor with options(${options}) Error: ${e}`
    );
  }
  return {};
};

/**
 * @description  Return a shortform version of the Id Hash
 * @argument {String} hash The ID Hash digest to shorten
 * @return {String} shortened Hash
 */
const getShortHash = hash => {
  return hash.substring(0, 12);
};

/**
 * @description  Return a unique hash given an App
 * @argument {App} app The App we want to know the Hash for
 * @return {String} md5 hash
 */
const getHashFromApp = app => {
  return getHashFromAppDescriptor(app.toJSON());
};

/**
 * @description  Return the body of the original request if there is one
 * @argument {Object} ctx The Koa context to parse the body from
 * @return {Object} Return Undefined, Buffer, String or JSON
 */
const getRequestBody = ctx => {
  let body = ctx.request.rawBody ? ctx.request.rawBody : ctx.request.body;
  if (body === null || body === undefined) {
    return undefined;
  }
  let contentType = ctx.request.header["content-type"];
  if (!Buffer.isBuffer(body) && typeof body !== "string") {
    if (contentType && contentType.indexOf("json") !== -1) {
      // If json or multipart then there still might be a JSON body by now due to middleware
      body = JSON.stringify(body);
    }
  }
  return body;
};

/**
 * @description  Return a unique hash given a JSON representation of a DockUI App
 * @argument {Object} descriptor The descriptor JSON to generate Hash from
 * @return {String} md5 hash
 */
const getHashFromAppDescriptor = descriptor => {
  const key = descriptor.key;
  const version = descriptor.version;
  const algo = "sha256";
  const config = {};
  const hash = crypto
    .createHash(algo, config)
    .update(`${key}${version}`)
    .digest("hex");
  return hash;
};

/**
 * @description  Return a unique hash given a Module
 * @argument {App} app The Module we want to know the Hash for
 * @return {String} md5 hash
 */
const getHashFromModule = module => {
  return getHashFromModuleDescriptor(module.toJSON());
};

/**
 * @description  Return a unique hash given a JSON representation of a DockUI Module
 * @argument {Object} descriptor The descriptor JSON to generate Hash from
 * @return {String} md5 hash
 */
const getHashFromModuleDescriptor = descriptor => {
  const key = descriptor.key;
  const type = descriptor.type;
  const appId = descriptor.appId;
  const algo = "sha256";
  const config = {};
  const hash = crypto
    .createHash(algo, config)
    .update(`${key}${type}${appId}`)
    .digest("hex");
  return hash;
};

/**
 * @description Return App Descriptor as JSON Object whether its object or Yaml to begin with
 * @argument {Object} descriptor The original descriptor Object/YAML
 * @return {Object} The Descriptor as Object
 */
const getDescriptorAsObject = descriptor => {
  // If not JSON already then turn the YAML into JSON
  let loaded = descriptor;
  if (!typeof descriptor === "object" || !descriptor.key) {
    loaded = yaml.safeLoad(descriptor);
  }
  if (typeof loaded === "object") {
    loaded = Object.assign({}, loaded);
  }
  return loaded;
};

/**
 * @description Loop through all promises in order as if syncronous
 * @argument {Array} array The original array of data
 * @argument {Function} callback The asyncronous callback to wait for
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(index, array[index], array);
  }
}

module.exports = {
  configAwareFetcher,
  fetch,
  getRequestBody,
  fetchBody,
  getDescriptorAsObject,
  getHashFromAppDescriptor,
  getHashFromApp,
  getHashFromModule,
  getHashFromModuleDescriptor,
  getShortHash,
  asyncForEach
};
