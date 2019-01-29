const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var proxyquire =  require('proxyquire');
var readFileSyncStub;
var ConfigYAMLLoader;
var ConfigFileLoader;
const {Config} = require("./Config");
const CONFIG_PATH = '/path/to/config.yml';
const CONFIG_VERSION = "1.0";
const INSTANCE1_NAME = "Instance 1";
const INSTANCE1_UUID = "instance-1-uuid";
const INSTANCE1_DESCRIPTION = "Instance 1 description";
const INSTANCE1_SOCKET = "/var/dockui/sockets/instance1";
const INSTANCE1_PORT = "8000";
const INSTANCE1_USER = "admin";
const INSTANCE1_PASS = "admin";
const CONFIG_DEFAULT = "prod";
const CONFIG_RESOURCE_INPUT_YAML = 
`
---
version: "${CONFIG_VERSION}"
instances:
  prod:
    name: "${INSTANCE1_NAME}"
    uuid: "${INSTANCE1_UUID}"
    description: "${INSTANCE1_DESCRIPTION}"
    management:
      api:
        socket:
          path: "${INSTANCE1_SOCKET}"
        http:
          port: "${INSTANCE1_PORT}"
        creds:
          user: "${INSTANCE1_USER}"
          password: "${INSTANCE1_PASS}"
default: "${CONFIG_DEFAULT}"
`;

describe('ConfigYAMLLoader', function() {
    "use strict";

    before(function() {
      readFileSyncStub = sinon.stub()
        .withArgs(CONFIG_PATH, { encoding: 'utf8' })
        .returns(CONFIG_RESOURCE_INPUT_YAML);
        ConfigFileLoader = proxyquire('./ConfigFileLoader', { fs : { readFileSync : readFileSyncStub } });
        ConfigYAMLLoader = proxyquire('./ConfigYAMLLoader', { './ConfigFileLoader' : ConfigFileLoader });                         
    });

    it('should be defined and loadable', function() {
      expect(ConfigYAMLLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(ConfigYAMLLoader).to.be.a('function');
    });

    it('should be able to parse a YAML file', function() {
      const configYAMLLoader = new ConfigYAMLLoader(CONFIG_PATH);
      expect(configYAMLLoader.load).to.be.a('function');
      const config = configYAMLLoader.load();
      expect(config).to.be.an.instanceOf(Config);
      
      expect(config.version).to.equal(CONFIG_VERSION);
      expect(config.defaultInstance).to.equal(CONFIG_DEFAULT);
      //expect(Object.keys(config.instances)).length.to.equal(1);
    });

});