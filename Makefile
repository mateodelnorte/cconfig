DEBUG?=config

test:
	$(MAKE) DEBUG=  test-debug
test-debug:
	env TEST.WITH.DOTS=1.1.1.1 DEBUG=$(DEBUG) ./node_modules/.bin/mocha -R spec --recursive

.PHONY: test
