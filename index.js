'use strict'
var koa = require('koa'),
	path = require('path'),
	co = require('co'),
	app = koa()

require('./boot.js')

var ErrorLogger = getLogger('error'),
	config = getConfig(),
	ENV = config.env,
	PORT = config.port

requireMod('log')(app)
requireMod('favicon')(app)
requireMod('html-processor')(app)
requireMod('staticServer')(app)

// if (ENV !== 'production') {
// 	requireMod('webpack-dev-server')(app)
// }
// // requireMod('session')(app)
requireMod('form')(app)
requireMod('template')(app)
// requireMod('proxy')(app)
// require('./cron')

co(function*() {
	// app.context.redis = requireMod('redis')
	// yield requireMod('mongoose')
	yield requireMod('router')(app)
	app.listen(PORT)
}).catch(function(err) {
    ErrorLogger.error('koaError:\n', err.stack)
})

process.on('uncaughtException', function (err) {
    ErrorLogger.error('uncaughtException:\n', err.stack)
})
.on('unhandledRejection', function(err) {
    ErrorLogger.error('unhandledRejection:\n', err.stack)
});
