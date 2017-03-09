[![Build Status](https://travis-ci.org/mateodelnorte/cconfig.svg?branch=master)](https://travis-ci.org/mateodelnorte/cconfig)

# cconfig

`cconfig` is a simple cascading config system. It provides a simple, but easily overrideable, solution for environment specific application config. 

cconfig loads a `config.js` or `config.json` file from your `process.cwd()`. If it finds that object, it will look for a property in it matching `process.env.NODE_ENV` (if undefined, it will use `NODE_ENV=development`) and overwrite any environment-specific properties found there. Then, it will overwrite that object using `process.env`. 

With `cconfig` you can define global and environment specific config values, and override them using command line level or system level environment variables. 

## Installation
```
    npm install cconfig
```
## Setup and usage
```
    NODE_ENV=development node myscript.js
```
cconfig uses the NODE_ENV env var to provide environmenet-specific configuration settings. Available settings include process environment variables provided to the process, as well as global and environment-specific settings specified in a config.json file. 

### config.js || config.json

cconfig can be loaded to expect a `config.json` or `config.js` file in the process' base directory cwd: 
```
    var config = require('cconfig')(); 
```
or you may specify a config file location (this is useful when your application is running in a different directory than where the config.js/config.json resides): 
```
    var config = require('cconfig')('./path/to/my/config.json'); 
    // ----- OR -----
    var config = require('cconfig')('./path/to/my/config.js')
``` 
alternatively, you may chose to provide an object as a base configuration
```
    var defaultConfig = { port: 1337 }
    var config = require('cconfig')(defaultConfig)
```

### Cascading Overrides 

The configuration provided through a file or object may include global values and values particular to any NODE_ENV environment name that may be specified. Global variables specified in config.json will override any process environment variable values, and environment-specific items in config.json will override default values defined there as well. 
```
    {
      "MULTI_ENV_VAR": "this var will be used in all environments",
      "OVERRIDEABLE_VAR": "this var will be used, unless overriden for another environment",
      "development": {
        "ANOTHER_VAR": "mongodb://somevalue:27017/somedb"
      },
      "staging": {
        "ANOTHER_VAR": "mongodb://somevalue2:27017/somedb,
        "OVERRIDEABLE_VAR": "this var will be used for staging, unless overriden for another environment",
      },
      "production": {
        "ANOTHER_VAR": "mongodb://somevalue3:27017/somedb,
        "OVERRIDEABLE_VAR": "this var will be used for production, unless overriden for another environment",
      }
    }
```    

usage is simple:

assuming `node myApp.js` or `NODE_ENV=development node myApp.js`:
```
    var config = require('cconfig')();
    
    console.log(config.NODE_ENV); // prints "development"
    console.log(config.MULTI_ENV_VAR"); // prints "this var will be used in all environments"
    console.log(config.OVERRIDEABLE_VAR"); // prints "this var will be used, unless overriden for another environment"
    console.log(config.ANOTHER_VAR"); // prints "mongodb://somevalue:27017/somedb"
```
assuming `NODE_ENV=staging node myApp.js`:
```
    var config = require('cconfig')();
    
    console.log(config.NODE_ENV); // prints "staging"
    console.log(config.MULTI_ENV_VAR"); // prints "this var will be used in all environments"
    console.log(config.OVERRIDEABLE_VAR"); // prints "this var will be used, unless overriden for another environment"
    console.log(config.ANOTHER_VAR"); // prints "mongodb://somevalue2:27017/somedb"
```
Individual values can be overriden by environment variables specified globally or inline as well. 

assuming: `OVERRIDEABLE_VAR="text straight from the command line" NODE_ENV=production node myApp.js`:
```
    var config = require('cconfig')();
    
    console.log(config.NODE_ENV); // prints "production"
    console.log(config.MULTI_ENV_VAR"); // prints "this var will be used in all environments"
    console.log(config.OVERRIDEABLE_VAR"); // text straight from the command line"
    console.log(config.ANOTHER_VAR"); // prints "mongodb://somevalue3:27017/somedb"
```

It's possible to override nested properties from the command line as well. Assuming a `config.js` file similar to the following:
```
module.exports = {
    BROKER: {
        HOST: 'localhost'
        PORT: 1243
    }
}
```
The `PORT` property can be overriden from the command line via: `"BROKER.PORT"=1235 node myApp.js`. If you're coding on Windows and want to be able to use similar behavior, see the very useful package [cross-env](https://www.npmjs.com/package/cross-env).

# Run the tests
```
    npm test
```
[1]: https://www.npmjs.org/package/cconfig
