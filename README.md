# cconfig

`cconfig` is a simple cascading config system

## Installation

    npm install cconfig

## Setup and usage

    NODE_ENV=development node myscript.js

cconfig uses the NODE_ENV env var to provide environmenet-specific configuration settings. Available settings include process environment variables provided to the process, as well as global and environment-specific settings specified in a config.json file. 

cconfig can be loaded to expect a `config.json` or `config.js` file in the process' base directory cwd: 

    var config = require('cconfig')(); 

or you may specify a config file location: 

    var config = require('cconfig')('./path/to/my/config.json'); 
    // ----- OR -----
    var config = require('cconfig')('./path/to/my/config.js')
    
alternatively, you may chose to provide an object as a base configuration

    var defaultConfig = { port: 1337 }
    var config = require('cconfig')(defaultConfig)

The configuration provided through a file or object may include global values and values particular to any NODE_ENV environment name that may be specified. Global variables specified in config.json will override any process environment variable values, and environment-specific items in config.json will override default values defined there as well. 

    {
      "MULTI_ENV_VAR": "this var will be used in all environments",
      "OVERRIDEABLE_VAR": "this var will be used, unless overriden for another environment",
      "development": {
        "ANOTHER_VAR": "mongodb://somevalue:27017/somedb"
      },
      "staging": {
        "ANOTHER_VAR": "mongodb://somevalue2:27017/somedb,
        "OVERRIDEABLE_VAR": "this var will be used, unless overriden for another environment",
      },
      "production": {
        "ANOTHER_VAR": "mongodb://somevalue3:27017/somedb,
        "OVERRIDEABLE_VAR": "this var will be used, unless overriden for another environment",
      }
    }
    

usage is simple, as all values are available as properties on the returned object:

    var config = require('cconfig')();
    
    console.log(config.NODE_ENV); // prints "development"
    console.log(config.MULTI_ENV_VAR"); // prints "this var will be used in all environments"
    console.log(config.OVERRIDEABLE_VAR"); // prints "this var will be used, unless overriden for another environment"
    console.log(config.ANOTHER_VAR"); // prints "mongodb://somevalue:27017/somedb"

# Run the tests

    npm test

[1]: https://www.npmjs.org/package/cconfig
