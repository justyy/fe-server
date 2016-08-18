'use strict'

var promiseAble = (function() {
    var promiseAble = function(fn) {
    	return new Promise(function(resolve, reject) {
    		fn(function(err,data) {
    			if (err) {
    				reject(err)
    			} else {
    				if (arguments.length > 2) {
                        data = [].slice.call(arguments, 1)
                    }
    				resolve(data)
    			}
    		})
    	})
    }
    return function(originFn) {
    	return function() {
            var args = [].slice.call(arguments)
        	return promiseAble(function(cb) {
        		args = args.concat(cb)
        		originFn.apply(this, args)
        	}.bind(this))
        }
    }
})()

module.exports = {
    promiseAble
}
