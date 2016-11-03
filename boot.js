var log4js = require('koa-log4')

global.getLogger = function(cat) {
	return log4js.getLogger(cat)
}

global.requireMod = function(mod) {
	return require('./components/' + mod)
}

global.requireModel = function(model) {
	return require('./model/' + model)
}
