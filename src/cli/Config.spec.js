const chai = require("chai");
const expect = chai.expect;

var {Config, ConfigBuilder, InstanceConfig, InstanceConfigBuilder} = require('./Config');

describe('Config', function() {
    "use strict";

    beforeEach(function(){
     
    });

    it('should be defined and loadable', function() {
      expect(Config).to.not.be.undefined;
      expect(ConfigBuilder).to.not.be.undefined;
      expect(InstanceConfig).to.not.be.undefined;
      expect(InstanceConfigBuilder).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(Config).to.be.a('function');
      expect(ConfigBuilder).to.be.a('function');
      expect(InstanceConfig).to.be.a('function');
      expect(InstanceConfigBuilder).to.be.a('function');
    });

    it('Should return a Config.Builder if one isnt passed as arg', function() {
      var builder = new Config();
      expect(builder).to.be.instanceof(ConfigBuilder);
    });

    describe('ConfigBuilder', function() {
    
      // version: "1.0"
      it('should be able to set the version as String or Int', function() {
        const config = new ConfigBuilder().withVersion("1.0").build();
        expect(config.version).to.equal("1.0");
      });

      // default
      it('should be able to set the default Instance', function() {
        const config = new ConfigBuilder().withDefaultInstance("prod").build();
        expect(config.defaultInstance).to.equal("prod");
      });

      // prod:
      it('should be able to add multiple instances using an InstanceConfigBuilder', function() {
        const config = new ConfigBuilder()
          .withInstance(
            new InstanceConfigBuilder().withName("prod").build()
          )
          .withInstance(
            new InstanceConfigBuilder().withName("ref").build()
          )
          .build();
        expect(Object.keys(config.instances).length).to.equal(2);
      });

      it('should return a Config instance when build is called', function() {
        const configInstance = new ConfigBuilder()
          .build();
        expect(configInstance).to.be.an.instanceOf(Config);  
      });

      describe('InstanceConfig', function() {

        //   name: "Human Readable Name"
        it('should be able to set a name', function() {
          expect(()=>{
            new InstanceConfig().withName("prod");
          }).to.not.throw();
        });

        //   uuid: "generated-instance-uuid-c4c5453c4"
        it('should be able to set a uuid', function() {
          expect(()=>{
            new InstanceConfig().withUUID("c4c5453c4-453c4-c4c5453c4-c4c54c");
          }).to.not.throw();
        });

        //   description: "A longer description of this instance"
        it('should be able to set a description', function() {
          expect(()=>{
            new InstanceConfig().withDescription("This instance is for production");
          }).to.not.throw();
        });        
        
        //   management.api.socket
        it('should be able to set a management socket', function() {
          expect(()=>{
            new InstanceConfig().withSocket("/var/dockui/sockets/someFile");
          }).to.not.throw();
        }); 

        //   http.port: "8008"
        it('should be able to set a HTTP Host Port to run on', function() {
          expect(()=>{
            new InstanceConfig().withPort(8008);
          }).to.not.throw();
        });

        //       creds:
        //         user: "admin"
        //         password: "generatedInstanceGlobalAdminPassword"
        it('should be able to set global Admin credentials', function() {
          expect(()=>{
            new InstanceConfig().withCreds("admin", "someG3n3rat3dP@ssword!!");
          }).to.not.throw();
        });
        
      });

    
    });

});


