var config = require('../src')(__dirname + '/support/config.json');

require('should');

describe('cconfig', function () {

	beforeEach(function () {
		config.__clear();
	})

	it('should load keys from config with keys from common base obj level', function () {
		config.should.have.property('common', 'common_value');
	});

	it('should load keys from config with keys from child sections matching NODE_ENV', function () {
		config.should.have.property('key', 'dev_value');
	});

	it('should load keys from process.env', function () {
		config.should.have.property('DEBUG', process.env.DEBUG);
	});

  it('should convert objects from environment variables with . format into object', function () {
    config.should.have.property('TEST');
    config.TEST.should.have.property('WITH');
    config.TEST.WITH.should.have.property('DOTS');
    config.TEST.WITH.DOTS.should.equal('1.1.1.1');
  });

  it('should accept an object as an already loaded config (for instance, from a webpack config)', function () {

		var config = require('../src')({
			some: 'larger',
			development: {
				object: { obj: 'ect' }
			}
		});

		config.should.have.property('some');
    config.should.have.property('object');
    config.object.should.have.property('obj', 'ect');
  });

});