var extend = require('extend');
var log    = require('debug')('config');
var path   = require('path');

var configEnvironments = process.env.CONFIG_ENVIRONMENTS
												 ? process.env.CONFIG_ENVIRONMENTS.split(',')
												 : ['development', 'qa', 'production'];

log('initializing config with environments %j', configEnvironments);

module.exports = function(configPath){

  (configPath) || (configPath = process.env.CONFIG_PATH || path.join(process.cwd(), 'config.json'));

	var config = require(configPath);
	var env    = process.env.NODE_ENV || 'development';
	var tmp    = config[env];

	configEnvironments.forEach(function (environment) {
		delete config[environment];
	});

	return extend(config, tmp, process.env);

};
