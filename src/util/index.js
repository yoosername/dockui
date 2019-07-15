const crypto = require("crypto");
const yaml = require("js-yaml");

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

module.exports = {
  getDescriptorAsObject,
  getHashFromAppDescriptor,
  getHashFromApp,
  getHashFromModule,
  getHashFromModuleDescriptor,
  getShortHash
};
