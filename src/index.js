const extend = require('extend');
const log = require('debug')('cconfig');
const path = require('path');
const filterKeysWithDots = require('./lib/filterKeysWithDots');
const setPathValue = require('./lib/setPathValue');

const configEnvironments = process.env.CONFIG_ENVIRONMENTS
	? process.env.CONFIG_ENVIRONMENTS.split(',')
	: ['development', 'qa', 'production'];

log('initializing config with environments %j', configEnvironments);

var config = null;

module.exports = function (configPath) {

	if (config) return config;

	if (typeof configPath === 'object') {
		config = configPath;
	} else {

		// First, get the configPath - this is either passed in when module is required
		// set in an environment variable named CONFIG_PATH, or found in config.json
		configPath = configPath || process.env.CONFIG_PATH || path.join(process.cwd(), 'config.json');

		// Build the config from the configPath
		
		try { // config.json
			config = require(configPath);
			log(`found json config file at ${configPath}`);
		} catch (e) {
			log(`no json config file found at ${configPath}`);
			// no file found at config.json
			configPath = path.join(process.cwd(), 'config.js');

			try { // config.js
				config = require(configPath);
				log(`found js config file at ${configPath}`);
			} catch (e) {
				log(`no js config file found at ${configPath}`);
				// no file found at config.json
				throw new Error('could not find valid config.json or config.js file');
			}	

		}
	} 

	const env = process.env.NODE_ENV || 'development';
	const currentEnvConfig = config[env];

	// remove environments from config
	configEnvironments.forEach(function (environment) {
		delete config[environment];
	});

	// extend config with currentEnvConfig and process.env
	extend(config, currentEnvConfig, process.env, {
		__clear: function () {
			config = null;
		}
	});

	// make objects out of keys that contain .
	const keysWithDots = filterKeysWithDots(config);
	keysWithDots.forEach(function(key) {
		const keyValue = config[key];
		setPathValue(config, key, keyValue);
		delete config[key];
	});

	if (process.env.NODE_ENV === undefined) config.NODE_ENV = 'development';

	return config;
};
