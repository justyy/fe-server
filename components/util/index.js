'use strict'
var fs = require('fs')

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

var walk = function(dir, cb) {
    var rets = []
    rets = fs.readdirSync(dir)
    if (cb) {
        rets = rets.filter(cb)
    }
    return rets
}

module.exports = {
    promiseAble,
	walk
}
