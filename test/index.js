var config = require('../index')(__dirname + '/support/config.json');

require('should');

describe('cconfig', function () {
	it('should load keys from config with keys from common base obj level', function () {
		config.should.have.property('common', 'common_value');
	});
	it('should load keys from config with keys from child sections matching NODE_ENV', function () {
		config.should.have.property('key', 'dev_value');
	});
	it('should load keys from process.env', function () {
		config.should.have.property('DEBUG', process.env.DEBUG);
	});
});
