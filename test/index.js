var assert = require('assert')
describe('test', function() {
	it('should pass', function(done) {
		setImmediate(function() {
			assert.equal(1, 1)
			done()
		})
	})
})