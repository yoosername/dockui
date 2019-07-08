const crypto = require("crypto");
const yaml = require("js-yaml");

/**
 * @description Return App specific information out of the descriptor for hashing purposes
 * @argument {Object} descriptor The descriptor Object to parse Hashable data from
 * @return {string} A Stringified representation of the hashable data
 */
const getHashableInfoFromDescriptor = descriptor => {
  const descriptorObj =
    typeof descriptor === "object" ? descriptor : JSON.parse(descriptor);
  const descriptorInfo = Object.assign({}, descriptorObj, { modules: {} });
  return JSON.stringify(descriptorInfo);
};

/**
 * @description Return a unique hash from a JSON representation of a DockUI descriptor
 * @argument {Object} descriptor The descriptor JSON to generate Hash from
 * @argument {String} algorithm The hasing algorithm to use (defaults to MD5)
 * @argument {Object} config Any additional Algorithm specific config
 */
const createHashFromDescriptorInfo = (descriptorInfo, algorithm, config) => {
  const algo = algorithm ? algorithm : "sha256";
  const hash = crypto
    .createHash(algo, config)
    .update(descriptorInfo)
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
  getHashableInfoFromDescriptor,
  createHashFromDescriptorInfo
};
