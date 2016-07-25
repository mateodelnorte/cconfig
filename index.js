var extend = require('extend');
var log = require('debug')('config');
var path = require('path');
var filterKeysWithDots = require('./lib/filterKeysWithDots');
var setPathValue = require('./lib/setPathValue');

var configEnvironments = process.env.CONFIG_ENVIRONMENTS
													? process.env.CONFIG_ENVIRONMENTS.split(',')
													: ['development', 'qa', 'production'];

log('initializing config with environments %j', configEnvironments);

module.exports = function (configPath) {
	// First, get the configPath - this is either passed in when module is required
	// set in an environment variable named CONFIG_PATH, or found in config.json
	configPath = configPath || process.env.CONFIG_PATH || path.join(process.cwd(), 'config.json');

	// Build the config from the configPath
	var config = require(configPath);

	// Find the current NODE_ENV
	// then store config settings for that environment in currentEnvConfig
	var env = process.env.NODE_ENV || 'development';
	var currentEnvConfig = config[env];

	// remove environments from config
	configEnvironments.forEach(function (environment) {
		delete config[environment];
	});

	// extend config with currentEnvConfig and process.env
	extend(config, currentEnvConfig, process.env);

	// make objects out of keys that contain .
	var keysWithDots = filterKeysWithDots(config);
	keysWithDots.forEach(function(key) {
		var keyValue = config[key];
		setPathValue(config, key, keyValue);
		delete config[key];
	});

	if (process.env.NODE_ENV === undefined) config.NODE_ENV = 'development';
	return config;
};
